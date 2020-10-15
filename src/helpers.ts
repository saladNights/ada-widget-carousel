import merge, { Options } from 'deepmerge';

interface CombineMergeOptions extends Options {
  cloneUnlessOtherwiseSpecified: <T>(item: Partial<T>, options: CombineMergeOptions) => Partial<T>;
  isMergeableObject: <T>(item: Partial<T>) => boolean;
}

export const combineMerge = <T>(target: Partial<T>[], source: Partial<T>[], options: CombineMergeOptions) => {
  const destination = target.slice();

  source.forEach((item: Partial<T>, index: number) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });

  return destination;
};
