const SectionBadge = ({ title }: { title: string }) => {
  return (
    <div className="bg-white text-primary-500 px-3 py-1 rounded-full shadow-badge uppercase w-fit text-xs">
      {title}
    </div>
  );
};

export default SectionBadge;
