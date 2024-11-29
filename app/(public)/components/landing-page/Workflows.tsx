import Image from 'next/image';

const Workflows = () => {
  return (
    <section className="relative p-6 md:p-0  md:mt-[200px] flex flex-col md:flex-row md:items-center md:gap-24 w-full md:max-w-[1080px] mx-auto justify-between">
      <div className="relative basis-1/2 flex flex-col order-2 md:order-1">
        <Image
          src="/images/workflows.svg"
          width={504}
          height={862}
          alt="Workflows"
        />
      </div>
      <div className="basis-1/2 order-1 md:order-2">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 bg-landing mb-3 text-center md:text-left">
          Workflows For Specific Ticket Types
        </h2>
        <p className="text-base text-gray-500 mt-3 max-w-prose text-center md:text-left">
          Choose the ticket types you accept from
          <br /> customer proxies
        </p>
      </div>
    </section>
  );
};

export default Workflows;
