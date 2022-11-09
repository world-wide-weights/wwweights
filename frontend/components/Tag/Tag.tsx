type TagProps = {
  /** Content of tag */
  children: React.ReactNode;

  /** href destination Link */
  to: String;

  /** Possibility to change color and background of tag */
  color?:
    | "red"
    | "indigo"
    | "pink"
    | "cyan"
    | "blue"
    | "emerald"
    | "amber"
    | "gray"
    | "slate"
    | "zinc"
    | "neutral"
    | "stone"
    | "orange"
    | "yellow"
    | "lime"
    | "green"
    | "teal"
    | "sky"
    | "violet"
    | "purple"
    | "fuchsia"
    | "rose";
};

/**
 * Tag
 */
export const Tag: React.FC<TagProps> = ({ children, to, color }) => {
  return (
    <a
      href={`${to}`}
      className={`inline-block bg-${color}-500 bg-opacity-30 text-${color}-800 rounded-full px-5 py-1 mr-2 mb-2`}
    >
      {children}
    </a>
  );
};
