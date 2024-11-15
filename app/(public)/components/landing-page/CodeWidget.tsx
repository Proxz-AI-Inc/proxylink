'use client';

import { FC, useState } from 'react';

const CodeWidget: FC = () => {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="w-[580px] bg-[#1C2333] rounded-lg">
      {/* Endpoints tabs */}
      <div className="flex justify-between bg-[#151926] rounded-t-lg gap-4 w-full">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-t-lg w-full ${
            activeTab === 'requests'
              ? 'bg-[#1c2334] text-gray-100'
              : 'text-gray-400'
          }`}
        >
          <span className="font-bold">POST</span>
          <br />
          <span className="text-[#bda9a6]">/cancel</span>
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-t-lg w-full ${
            activeTab === 'offers'
              ? 'bg-[#1c2334] text-gray-100'
              : 'text-gray-400'
          }`}
        >
          <span className="font-bold">GET</span>
          <br />
          <span className="text-[#bda9a6]">/save-offers</span>
        </button>
        <button
          onClick={() => setActiveTab('webhook')}
          className={`px-4 py-2 rounded-t-lg w-full ${
            activeTab === 'webhook'
              ? 'bg-[#1c2334] text-gray-100'
              : 'text-gray-400'
          }`}
        >
          <span className="font-bold">PATCH</span>
          <br />
          <span className="text-[#bda9a6]">/webhook/status</span>
        </button>
      </div>

      {/* Code example */}
      <div className="font-mono text-sm p-6 h-[480px] overflow-y-auto">
        {activeTab === 'requests' && (
          <pre className="whitespace-pre-wrap">
            <code>
              <span className="text-[#8B8B8B]">
                {`// Using ProxyLink's API for subscription cancellations`}
              </span>
              {'\n'}
              <span className="text-[#8B8B8B]">
                {`// https://github.com/proxylink/cancellation-api`}
              </span>
              {'\n\n'}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">axios</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#4D9375]">require</span>
              <span className="text-white">(</span>
              <span className="text-[#C98A7D]">&apos;axios&apos;</span>
              <span className="text-white">);</span>
              {'\n\n'}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">apiKey</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#A1B1CA]">process.env</span>
              <span className="text-white">.</span>
              <span className="text-[#A1B1CA]">PROXYLINK_API_KEY</span>
              <span className="text-white">;</span>
              {'\n\n'}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">cancellationRequest</span>{' '}
              <span className="text-white">= {`{`}</span>
              {'\n'}
              {'  '}
              <span className="text-[#A1B1CA]">customerName</span>
              <span className="text-white">:</span>{' '}
              <span className="text-[#C98A7D]">&quot;John Doe&quot;</span>
              <span className="text-white">,</span>
              {'\n'}
              {'  '}
              <span className="text-[#A1B1CA]">accountNumber</span>
              <span className="text-white">:</span>{' '}
              <span className="text-[#C98A7D]">&quot;123456789&quot;</span>
              <span className="text-white">,</span>
              {'\n'}
              {'  '}
              <span className="text-[#A1B1CA]">lastDigitsCC</span>
              <span className="text-white">:</span>{' '}
              <span className="text-[#C98A7D]">&quot;1234&quot;</span>
              <span className="text-white">,</span>
              {'\n'}
              {'  '}
              <span className="text-[#A1B1CA]">email</span>
              <span className="text-white">:</span>{' '}
              <span className="text-[#C98A7D]">
                &quot;john.doe@example.com&quot;
              </span>
              {'\n'}
              <span className="text-white">{`}`};</span>
              {'\n\n'}
              <span className="text-[#A1B1CA]">axios</span>
              <span className="text-white">.</span>
              <span className="text-[#4D9375]">post</span>
              <span className="text-white">(</span>
              <span className="text-[#C98A7D]">
                &apos;https://api.proxylink.com/cancel&apos;
              </span>
              <span className="text-white">,</span>
              {'\n'}
              {'  '}
              <span className="text-[#A1B1CA]">cancellationRequest</span>
              <span className="text-white">,</span>
              {'\n'}
              {'  '}
              <span className="text-white">{`{`}</span>
              {'\n'}
              {'    '}
              <span className="text-[#A1B1CA]">headers</span>
              <span className="text-white">: {`{`}</span>
              {'\n'}
              {'      '}
              <span className="text-[#A1B1CA]">Authorization</span>
              <span className="text-white">:</span>{' '}
              <span className="text-[#C98A7D]">{`Bearer apiKey`}</span>
              {'\n'}
              {'    '}
              <span className="text-white">{`}`}</span>
              {'\n'}
              {'  '}
              <span className="text-white">{`}`}</span>
              {'\n'}
              <span className="text-white">);</span>
            </code>
          </pre>
        )}

        {activeTab === 'offers' && (
          <pre className="whitespace-pre-wrap">
            <code>
              <span className="text-[#8B8B8B]">
                {`// Get available save offers for customer`}
              </span>
              {'\n'}
              <span className="text-[#8B8B8B]">
                {`// https://github.com/proxylink/cancellation-api`}
              </span>
              {'\n\n'}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">axios</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#4D9375]">require</span>
              <span className="text-white">(</span>
              <span className="text-[#C98A7D]">&apos;axios&apos;</span>
              <span className="text-white">);</span>
              {'\n\n'}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">customerId</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#C98A7D]">&quot;cus_1234567890&quot;</span>
              <span className="text-white">;</span>
              {'\n\n'}
              <span className="text-[#A1B1CA]">axios</span>
              <span className="text-white">.</span>
              <span className="text-[#4D9375]">get</span>
              <span className="text-white">(</span>
              <span className="text-[#C98A7D]">
                &apos;https://api.proxylink.com/save-offers&apos;
              </span>
              <span className="text-white">,</span>
              {'\n'}
              {'  '}
              <span className="text-white">{`{`}</span>
              {'\n'}
              {'    '}
              <span className="text-[#A1B1CA]">params</span>
              <span className="text-white">: {`{`}</span>{' '}
              <span className="text-[#A1B1CA]">customerId</span>{' '}
              <span className="text-white">{`}`},</span>
              {'\n'}
              {'    '}
              <span className="text-[#A1B1CA]">headers</span>
              <span className="text-white">: {`{`}</span>
              {'\n'}
              {'      '}
              <span className="text-[#A1B1CA]">Authorization</span>
              <span className="text-white">:</span>{' '}
              <span className="text-[#C98A7D]">{`Bearer process.env.PROXYLINK_API_KEY`}</span>
              {'\n'}
              {'    '}
              <span className="text-white">{`}`}</span>
              {'\n'}
              {'  '}
              <span className="text-white">{`}`}</span>
              <span className="text-white">)</span>
              {'\n'}
              {'  '}
              <span className="text-white">.</span>
              <span className="text-[#4D9375]">then</span>
              <span className="text-white">(</span>
              <span className="text-[#A1B1CA]">response</span>{' '}
              <span className="text-white">=&gt;</span>{' '}
              <span className="text-white">{`{`}</span>
              {'\n'}
              {'    '}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-white">{`{`}</span>{' '}
              <span className="text-[#A1B1CA]">offers</span>{' '}
              <span className="text-white">{`}`}</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#A1B1CA]">response.data</span>
              <span className="text-white">;</span>
              {'\n'}
              {'  '}
              <span className="text-white">{`}`}</span>
              <span className="text-white">);</span>
            </code>
          </pre>
        )}

        {activeTab === 'webhook' && (
          <pre className="whitespace-pre-wrap">
            <code>
              <span className="text-[#8B8B8B]">
                {`// Webhook receiving status updates from ProxyLink`}
              </span>
              {'\n'}
              <span className="text-[#8B8B8B]">
                {`// ProxyLink will send PATCH requests to your endpoint`}
              </span>
              {'\n\n'}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">express</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#4D9375]">require</span>
              <span className="text-white">(</span>
              <span className="text-[#C98A7D]">&apos;express&apos;</span>
              <span className="text-white">);</span>
              {'\n'}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">app</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#4D9375]">express</span>
              <span className="text-white">();</span>
              {'\n\n'}
              <span className="text-[#A1B1CA]">app</span>
              <span className="text-white">.</span>
              <span className="text-[#4D9375]">patch</span>
              <span className="text-white">(</span>
              <span className="text-[#C98A7D]">
                &apos;/webhook/status&apos;
              </span>
              <span className="text-white">,</span>{' '}
              <span className="text-white">(</span>
              <span className="text-[#A1B1CA]">req</span>
              <span className="text-white">,</span>{' '}
              <span className="text-[#A1B1CA]">res</span>
              <span className="text-white">) =&gt;</span>{' '}
              <span className="text-white">{`{`}</span>
              {'\n'}
              {'  '}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-white">{`{`}</span>{' '}
              <span className="text-[#A1B1CA]">requestId</span>
              <span className="text-white">,</span>{' '}
              <span className="text-[#A1B1CA]">status</span>
              <span className="text-white">,</span>{' '}
              <span className="text-[#A1B1CA]">updatedAt</span>{' '}
              <span className="text-white">{`}`}</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#A1B1CA]">req.body</span>
              <span className="text-white">;</span>
              {'\n\n'}
              {'  '}
              <span className="text-[#8B8B8B]">
                {`// Verify webhook signature`}
              </span>
              {'\n'}
              {'  '}
              <span className="text-[#4D9375]">const</span>{' '}
              <span className="text-[#A1B1CA]">signature</span>{' '}
              <span className="text-white">=</span>{' '}
              <span className="text-[#A1B1CA]">req.headers</span>
              <span className="text-white">[</span>
              <span className="text-[#C98A7D]">
                &apos;x-proxylink-signature&apos;
              </span>
              <span className="text-white">];</span>
              {'\n\n'}
              {'  '}
              <span className="text-[#8B8B8B]">
                {`// Update request status in your database`}
              </span>
              {'\n'}
              {'  '}
              <span className="text-[#A1B1CA]">res</span>
              <span className="text-white">.</span>
              <span className="text-[#4D9375]">sendStatus</span>
              <span className="text-white">(</span>
              <span className="text-[#C98A7D]">200</span>
              <span className="text-white">);</span>
              {'\n'}
              <span className="text-white">{`}`}</span>
              <span className="text-white">);</span>
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodeWidget;
