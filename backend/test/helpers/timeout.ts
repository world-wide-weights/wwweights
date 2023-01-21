import { setTimeout } from 'timers/promises';

export const timeout = async (time = 50) => await setTimeout(time);
