import { AppDataSource } from "../../../database/database";
import { User } from "../../../database/entities/user";

export const updateUserSocketId = async (userId: number, socketId: string) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.socketId = socketId;
      await userRepo.save(user);
    }
  }