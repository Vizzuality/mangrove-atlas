export type UseQueryParams = {
  name_is?: string; // returns up to one result that exactly matches the provided value.
  name_contains?: string; // returns only results that contain the fragment, case-insensitive.
};
