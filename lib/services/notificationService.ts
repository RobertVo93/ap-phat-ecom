import { INotificationFilter, INotificationSettings, NotificationType } from "@/types";
import { NotificationEntity } from "../database/entities/notification.entity"
import { AppDataSource } from "../database/typeorm"
import { NotificationSettingsEntity, UserEntity } from "../database/entities";

export async function getAllNotificationsService({
  userId,
  offset = 0,
  limit = 10,
}: INotificationFilter) {
  try {
    const notiRepo = AppDataSource.getRepository(NotificationEntity)
    const settingsRepo = AppDataSource.getRepository(NotificationSettingsEntity)

    const userSettings = await settingsRepo.findOne({ where: { user: { id: userId } } })
    if (!userSettings) {
      throw new Error("Settings not found");
    }

    const allowedTypes: NotificationType[] = [
      userSettings.orderEnabled && NotificationType.order,
      userSettings.promotionEnabled && NotificationType.promotion,
    ].filter(Boolean) as NotificationType[];

    if (allowedTypes.length === 0 || userSettings.muteUntil) {
      return {
        data: [],
        total: 0,
        offset,
        limit,
        hasMore: false,
      };
    }

    const qb = notiRepo
      .createQueryBuilder("notification")
      .innerJoin("notification.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("notification.type IN (:...allowedTypes)", { allowedTypes })
      .orderBy("notification.createdAt", "DESC")
      .skip(offset)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      offset,
      limit,
      hasMore: offset + data.length < total,
    };
  } catch (error) {
    console.error("getAllNotificationsService error:", error);
    throw error;
  }
}

export async function getUnreadCountService(userId: string) {
  try {
    const repo = AppDataSource.getRepository(NotificationEntity)
    const settingsRepo = AppDataSource.getRepository(NotificationSettingsEntity)

    const userSettings = await settingsRepo.findOne({ where: { user: { id: userId } } })
    if (!userSettings) {
      throw new Error("Settings not found");
    }
    const allowedTypes: NotificationType[] = [
      userSettings.orderEnabled && NotificationType.order,
      userSettings.promotionEnabled && NotificationType.promotion,
    ].filter(Boolean) as NotificationType[];

    if (allowedTypes.length === 0 || userSettings.muteUntil) {
      return {
        unreadNumber: 0
      };
    }

    const count = await repo
      .createQueryBuilder("notification")
      .innerJoin("notification.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("notification.isRead = :isRead", { isRead: false })
      .andWhere("notification.type IN (:...allowedTypes)", { allowedTypes })
      .getCount();

    return {
      unreadNumber: count
    }
  } catch (error) {
    console.error("getUnreadCountService error:", error);
    throw error;
  }
}

export const markAsReadService = async (id: string) => {
  const repo = AppDataSource.getRepository(NotificationEntity);

  const updated = await repo.update(id, {
    isRead: true,
    readAt: new Date()
  });

  if (updated.affected === 0) {
    throw new Error("Notification not found");
  }

  return await repo.findOne({ where: { id } });
};

export const markAllAsReadService = async (userId: string) => {
  const repo = AppDataSource.getRepository(NotificationEntity);

  await repo.update(
    {
      user: { id: userId },
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );

  return { success: true, message: "All notifications marked as read" };
};

export const getNotificationSettingsService = async (userId: string) => {
  const settingsRepo = AppDataSource.getRepository(NotificationSettingsEntity)

  let settings = await settingsRepo.findOne({ where: { user: { id: userId } } })
  if (!settings) {
    const userRepo = AppDataSource.getRepository(UserEntity)
    const user = await userRepo.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error("User not found");
    }
    settings = settingsRepo.create({
      user: user!,
      orderEnabled: true,
      promotionEnabled: true,
      inappEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      muteUntil: undefined,
    })
  } else {
    if (settings.muteUntil && new Date() > new Date(settings.muteUntil)) {
      settings.muteUntil = null as any;
    }
  }

  return await settingsRepo.save(settings)
}

export const updateNotificationSettingsService = async (id: string, data: INotificationSettings) => {
  const repo = AppDataSource.getRepository(NotificationSettingsEntity)
  const updated = {...data, muteUntil: data.muteUntil ?? null}
  await repo.update(id, updated as any);
  return repo.findOneBy({ id });
}