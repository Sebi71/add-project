import { ProjectsViewProps } from "@/types/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const ProjectsView: React.FC<ProjectsViewProps> = ({ theme, projects }) => {
  return (
    <>
      <h2>{theme}</h2>
      <div>
        {projects.map((project) => (
          <div key={project.id}>
            <Image
              src={project.cover}
              alt={project.title}
              width={1024}
              height={460}
              style={{ objectFit: 'cover' }}
            />
            <h3>{project.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectsView;

