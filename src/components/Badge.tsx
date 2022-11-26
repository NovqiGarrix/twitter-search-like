import { FunctionComponent } from "react";

interface IBadgeProps {
  badge: string;
}

const Badge: FunctionComponent<IBadgeProps> = (props) => {
  const { badge } = props;

  return (
    <span className="bg-blue-200 text-blue-800 text-sm font-semibold mr-1.5 mb-1.5 px-2.5 py-0.5 rounded">
      {badge}
    </span>
  );
};

export default Badge;
