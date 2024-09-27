import { ProjectsViewProps } from "@/types/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const ProjectsView: React.FC<ProjectsViewProps> = ({ theme, projects }) => {
  const filterProjectsDate = projects.sort((a, b) => {
    return b.date?.seconds - a.date?.seconds;
  });

  return (
    <>
      <h2 className="text-xl font-black text-center pt-4 mb-4">{theme} :</h2>
      <div className="max-w-[1200px] pb-6 pl-4 pr-4 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2">
        {filterProjectsDate.map((project) => (
          <div key={project.id}>
            <Card className="h-full p-3 hover:translate-y-[-10px] transition-all">
              <div className="w-full relative">
                <Image
                  src={project.cover}
                  alt={`photo de couverture du projet ${project.title}`}
                  width={1024}
                  height={460}
                  className="h-[200px] object-cover"
                  priority
                />
              </div>
              <h3 className="font-black uppercase mt-4">{project.title}</h3>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectsView;
