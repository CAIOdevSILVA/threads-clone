import { fetchUser, getActivity } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

const Page = async () => {
  const user = await currentUser();
  if(!user) return null

  const userInfo = await fetchUser(user.id);

  if(!userInfo?.onboarded) redirect("/onboarding");

	const activity = await getActivity(userInfo?._id);

  return (
    <>
			<section>
				<h1 className="head-text mb-10">Activity</h1>

				<section className="mt-10 flex flox-col gap-5">
					{activity.length > 0 ? (
						<>
							{activity.map((activity) => (
								<Link
									key={activity?.id}
									href={`/thread/${activity?.parentId}`}
								>
									<article className="activity-card">
										<Image
											src={activity.author.image}
											alt="Profile Photo"
											width={20}
											height={20}
											className="rounded-full object-contain"
										/>
										<p className="!text-small-regular text-light-1">
											<span className="mr-1 text-primary-500">{activity?.author.name}</span>{" "}
											replied to your thread
										</p>
									</article>
								</Link>
							))}
						</>
					) : (
						<>
							<p className="!text-base-regular text-gray-1">No activity yet</p>
						</>
					)}
				</section>
			</section>
		</>
  )
}

export default Page;