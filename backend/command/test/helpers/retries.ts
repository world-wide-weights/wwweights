// NOT used anymore but may be required later

// import { Model } from 'mongoose';
// import { timeout } from './timeout';

// type Requirement = {
//   model: Model<any>;
//   count: number;
// };

// export const retries = async (
//   requirements: Requirement[],
//   maxAttempts = 25,
// ) => {
//   let attempts = 0;
//   while (!(await checkCounts(requirements)) && attempts < maxAttempts) {
//     attempts++;
//     await timeout();
//   }
//   if (attempts >= maxAttempts) return false;
//   return true;
// };

// const checkCounts = async (requirements: Requirement[]) => {
//   const promises = [];
//   for (const requirement of requirements) {
//     promises.push(await checkSingleCount(requirement));
//   }
//   const results = await Promise.all(promises);
//   for (const result of results) {
//     if (!result) return false;
//   }
//   return true;
// };

// const checkSingleCount = async (requirement: Requirement) => {
//   const count = await requirement.model.count();
//   if (count < requirement.count) return false;
//   return true;
// };

export const retryCallback = async (
  cb: () => Promise<boolean>,
  maxDuration = 1000,
) => {
  const startTime = performance.now();
  while (performance.now() - startTime < maxDuration) {
    const currRes = await cb();
    if (currRes) {
      return true;
    }
  }
  throw new Error('Callback condition never met. Timeout!');
};
