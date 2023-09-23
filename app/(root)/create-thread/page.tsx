import { fetchUser } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostThreads from "@/components/forms/PostThreads";

const Page = async () => {
  const user = await currentUser();

  if(!user) return null

  const userInfo = await fetchUser(user.id);

  if(!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      <PostThreads userId={userInfo?._id}/>
    </>
  )
}

export default Page;