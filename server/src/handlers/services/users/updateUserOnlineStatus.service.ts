import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";

export const updateUserOnlineStatus = async (userId: number, isOnline: boolean) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.isOnline = isOnline;
      await userRepo.save(user);
    }
  }