"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validatitions/thread";
// import { createThread } from "@/lib/actions/thread.actions";

import * as z from "zod";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface CommentProps {
	threadId: string;
	currentUserImg: string;
	currentUserId: string;
}

const Comment = ({
	threadId, currentUserId, currentUserImg
}: CommentProps) => {
	const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });

  const onSubmit = async(values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

    form.reset();
  }

	return (
		<>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="comment-form"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel>
                  <Image
										src={currentUserImg}
										alt="current User image"
										width={48}
										height={48}
										className="rounded-full object-cover overflow-hidden"
									/>
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
										placeholder="Comment..."
										className="no-focus text-light-1 outline-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary-500 comment-form_btn">
            Reply
          </Button>
        </form>
      </Form>
    </>
	)
}

export default Comment
