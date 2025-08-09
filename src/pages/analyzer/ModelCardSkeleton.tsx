import { Paper, Skeleton } from "@mui/material";

export const ModelCardSkeleton = () => {
  return (
    <Paper variant="outlined" className="p-6">
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="rectangular" height={70} className="mt-2" />
      <Skeleton variant="rectangular" height={40} className="mt-4" />
    </Paper>
  );
};

export default ModelCardSkeleton;