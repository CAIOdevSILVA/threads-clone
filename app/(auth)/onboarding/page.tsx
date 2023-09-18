import { UserButton } from "@clerk/nextjs";

const Page = () => {
  return (
    <>
      <h1>Onboarding</h1>
      <UserButton afterSignOutUrl="/"/>
    </>
  )
}

export default Page;