import { fetchUser, getActivity } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const Page = async () => {
  const user = await currentUser();
  if(!user) return null

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect("/onboarding");


  return (
    <>
			<section>
				<h1 className="head-text mb-10">Communities</h1>
			</section>
		</>
  )
}

export default Page;
