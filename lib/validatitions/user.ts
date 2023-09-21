import * as z from 'zod';

export const userValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z.string().min(3).max(10),
  username: z.string().min(3).max(10),
  bio: z.string().min(3).max(1000),
});