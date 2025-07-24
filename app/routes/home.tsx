import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasya AI" },
    { name: "description", content: "Welcome to Tasya AI!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('images/bg-main.svg')] bg-cover">
      <Navbar/>
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications and Resume Ratings</h1>
          <h2>Review your submission and check AI powered Suggestions</h2>
        </div>
      

{resumes.length > 0 && (
  <div className="resumes-section">
        {resumes.map((resume) => (
        <ResumeCard resume={resume} key={resume.id} />
      ))}
      </div>
)}

      

      
</section>
    </main>
  );
}
