import SectionBadge from './SectionBadge';
import CodeWidget from './CodeWidget';

const ApiForProxies = () => {
  return (
    <div className="relative bg-[#111729] py-32">
      <div className="max-w-[1080px] mx-auto flex flex-row justify-between">
        {/* Left content */}
        <div className="max-w-[420px]">
          <div className="mb-4">
            <SectionBadge title="PROXY" />
          </div>
          <h2 className="text-5xl font-semibold text-white mb-4">
            An API for Proxies to streamline their operation.
          </h2>
          <p className="text-gray-400 mb-8">
            Use the ProxyLink API to automate cancellation requests and save
            offers.
          </p>
          <button className="bg-[#534CFB] text-white px-6 py-3 rounded-lg hover:bg-[#4339FB] transition-colors">
            Request Access
          </button>
        </div>

        {/* Code widget */}
        <CodeWidget />
      </div>
    </div>
  );
};

export default ApiForProxies;
