import { ProjectsViewProps } from "@/types/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
  const date = new Date(timestamp.seconds * 1000); 
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0"); 
  return `${day}-${month}-${year}`;
};

const ProjectsView: React.FC<ProjectsViewProps> = ({ theme, projects }) => {
  const filterProjectsDate = projects.sort((a, b) => {
    return b.date?.seconds - a.date?.seconds;
  });

  return (
    <>
      <h3 className="text-xl pt-4 mb-4 ml-4">{theme} :</h3>
      <div className="max-w-[1200px] pb-10 pl-4 pr-4 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2">
        {filterProjectsDate.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="h-full p-3 hover:translate-y-[-10px] transition-all">
              <div className="w-full relative">
                <Image
                  src={project.cover}
                  alt={`photo de couverture du projet ${project.title}`}
                  width={1024}
                  height={460}
                  className="h-[200px] w-auto object-cover"
                  priority
                />
              </div>
              <h3 className="font-black uppercase mt-4">{project.title}</h3>
              <span>{formatDate(project.date)}</span>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ProjectsView;
