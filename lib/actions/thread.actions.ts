"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text, author, communityId, path
}: CreateThreadParams){
  try {
    connectToDb()

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error}`);
  }
};

export async function fetchThreads(pageNumber = 1, pageSize = 20){
	connectToDb();
  try {

    const skipAmount = (pageNumber - 1) * pageSize;

    const threadsQuery = Thread.find({ parentId:{ $in: [null, undefined]}})
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image"
        }
      });

    const totalThreadsCount = await Thread.countDocuments({ parentId:{ $in: [null, undefined]}});

    const threads = await threadsQuery.exec();
    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };

  } catch (error) {
    throw new Error(`Failed to fetch threads: ${error}`);
  }
}

export async function fetchThreadById(id: string) {
	connectToDb();
	try {
		const thread = await Thread.findById(id)
		.populate({
			path: "author",
			model: User,
			select: "_id id name image"
		})
		.populate({
			path: "children",
			populate: [
				{
					path: "author",
					model: User,
					select: "_id id name parentId image"
				},
				{
					path: "children",
					model: Thread,
					populate: {
						path: "author",
						model: User,
						select: "_id id name parentId image"
					}
				}
			]
		}).exec();

		return thread;
	} catch (error: any) {
		throw new Error(`Failed to fetch threads: ${error}`);
	}
}

export async function addCommentToThread(
	threadId: string,
	commentText: string,
	userId: string,
	path: string
){
	connectToDb();

	try {
		// find the original thread
		const originalThread = await Thread.findById(threadId);
		if(!originalThread) {
			throw new Error("Thread not found");
		}

		//create a new thread with the comment Text
		const commentThread = new Thread({
			text: commentText,
			author: userId,
			parentId: threadId
		});

		//Save the new thread
		const savedCommentThread = await commentThread.save();

		//Update the original Thread to include the new comment
		originalThread.children.push(savedCommentThread._id);

		//Save the original Thread
		await originalThread.save();

		revalidatePath(path);

	} catch (error: any) {
		throw new Error(`Failed to create comment in threads: ${error}`);
	}
}
