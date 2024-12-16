import { DonutChart, List, ListItem } from '@tremor/react';
import clsx from 'clsx';
import { Loader } from '../ui/spinner';

const SourcesCard: React.FC<{
  data: {
    name: string;
    amount: number;
    share: string;
    color: string;
  }[];
  isLoading: boolean;
}> = ({ data, isLoading }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-5 min-h-[200px]">
    <h2 className="text-lg font-medium pl-2">Sources</h2>

    {isLoading && <Loader />}

    {!isLoading && data.length === 0 && (
      <div className="flex justify-center items-center h-full">
        <p>No data available</p>
      </div>
    )}

    {!isLoading && data.length > 0 && (
      <div className="flex gap-5 pt-8">
        <div className="basis-1/2 h-full flex flex-col justify-center">
          <DonutChart
            data={data}
            category="amount"
            index="name"
            colors={['orange', 'blue', 'red', 'purple', 'gray']}
            variant="donut"
            showAnimation={true}
          />
        </div>
        <div className="basis-1/2 h-full flex flex-col justify-center">
          <p className="text-tremor-label text-tremor-content flex items-center justify-between mb-2">
            <span>Category</span>
            <span>Amount / Share</span>
          </p>
          <List>
            {data.map(item => (
              <ListItem key={item.name} className="space-x-6">
                <div className="flex items-center space-x-2.5 truncate">
                  <span
                    className={clsx(
                      item.color,
                      'h-2.5 w-2.5 shrink-0 rounded-sm',
                    )}
                    aria-hidden={true}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium tabular-nums">
                    {item.amount}
                  </span>
                  <span className="rounded-sm bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums">
                    {item.share}
                  </span>
                </div>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    )}
  </div>
);

export default SourcesCard;
