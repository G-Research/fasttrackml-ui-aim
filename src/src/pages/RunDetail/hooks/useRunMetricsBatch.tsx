import React from 'react';

import runDetailAppModel from 'services/models/runs/runDetailAppModel';

function useRunMetricsBatch({
  runTraces,
  runHash,
  startIndex,
  count,
  fetchMore,
}: {
  runTraces: any;
  runHash: string;
  startIndex?: number;
  count?: number;
  fetchMore?: () => void;
}) {
  React.useEffect(() => {
    if (startIndex !== undefined && count) {
      console.log(
        'sliced metrics: ',
        runTraces.metric.slice(startIndex, startIndex + count),
      );
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTraces, runHash, startIndex, count]);

  React.useEffect(() => {
    if (fetchMore) {
      fetchMore();
    }
  }, [fetchMore]);
}

export default useRunMetricsBatch;
