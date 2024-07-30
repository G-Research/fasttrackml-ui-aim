import React from 'react';

import runDetailAppModel from 'services/models/runs/runDetailAppModel';

function useRunMetricsBatch({
  runTraces,
  runHash,
  startIndex = 0,
  count = 500, // Error occurs if count is greater than 1000
}: {
  runTraces: any;
  runHash: string;
  startIndex?: number;
  count?: number;
}) {
  React.useEffect(() => {
    const fetchMetricsBatch = () => {
      const runsBatchRequestRef = runDetailAppModel.getRunMetricsBatch(
        startIndex !== undefined && count
          ? runTraces.metric.slice(startIndex, startIndex + count)
          : runTraces.metric,
        runHash,
      );

      runsBatchRequestRef.call();

      return () => {
        runsBatchRequestRef.abort();
      };
    };

    fetchMetricsBatch();
  }, [runTraces, runHash, startIndex, count]);
}

export default useRunMetricsBatch;
