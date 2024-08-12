const asyncHandler = require('../../utils/error-handlers/catch-async.js');
const { sequelize, Sequelize } = require('../../models');
const { Op, QueryTypes, where } = require('sequelize');
const { sendSuccess } = require('../../utils/response/response-utils.js');
const { emitSocketEvent } = require('../../lib/socket/socket-manager.js');
const { CHAT_EVENTS } = require('../../lib/socket/chat-events.js');
const initModels = require('../../models/init-models.js');
const Models = require('../../models');
const { getPaginatedResults } = require('../../utils/helpers.js');
const { getUnreadMessagesCount } = require('./controller-utils.js');
const { RESPONSE_MSGS } = require('../../utils/response/response-messages.js');
const STATUS_CODES = require('../../utils/response/status-codes.js');
const AppError = require('../../utils/error-handlers/app-error.js');


const { users, userRoles, roles, chatConstants, chatMessages } = initModels(Models.sequelize);

module.exports = {

  createChat: asyncHandler(async (req, res, next) => {



    const currentUserId = req.user.id;



    const receiverId = req?.params?.receiverSlug;

    // return res.send({ currentUserId, id: req.user.id })

    let chat = await chatConstants.findOne({
      where: {
        [Op.or]: [
          {
            user1Id: receiverId,
            user2Id: req.user.id,
          },
          {
            user1Id: req.user.id,
            user2Id: receiverId,
          },
        ],
      },
      raw: true,
    });


    if (!chat) {
      chat = await chatConstants.create({
        user1Id: req.user.id,
        user2Id: receiverId,
      });

      chat = await sequelize.query(
        `
    SELECT 
      c.*,
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u1."id"
        ELSE u2."id"
      END AS "senderId",
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u1."name"
        ELSE u2."name"
      END AS "senderName",
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u1."email"
        ELSE u2."email"
      END AS "senderEmail",
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u1."image"
        ELSE u2."image"
      END AS "senderImage",
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u2."id"
        ELSE u1."id"
      END AS "receiverId",
      (
        SELECT "isOnline"
        FROM "users" u
        WHERE u."id" = (
          CASE 
            WHEN c."user1Id" = :loggedInUser THEN u2."id"
            ELSE u1."id"
          END
        )
      ) AS "isOnline",
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u2."name"
        ELSE u1."name"
      END AS "receiverName",
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u2."email"
        ELSE u1."email"
      END AS "receiverEmail",
      CASE 
        WHEN c."user1Id" = :loggedInUser THEN u2."image"
        ELSE u1."image"
      END AS "receiverImage",
      (
        SELECT COUNT(*)
        FROM "chatMessages"
        WHERE "chatId" = c."id"
          AND "receiverId" = :loggedInUser
          AND "isRead" = false
      ) AS "unreadMessagesCount",
      (
        SELECT "message"
        FROM "chatMessages"
        WHERE c."lastMessageId" = "chatMessages"."id"
      ) AS "lastMessage"
    FROM 
      "chatConstants" c
    JOIN 
      "users" u1 ON c."user1Id" = u1."id"
    JOIN 
      "users" u2 ON c."user2Id" = u2."id"
    WHERE 
      c."id" = ${chat.id}
  `,
        {
          replacements: { loggedInUser: receiverId },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.CHAT_CREATED, chat);
    } else {
      let fieldsToUpdate = {
        user1Id: req.user.id,
        user2Id: receiverId,
      };

      if (chat.deletedBy == currentUserId) {
        fieldsToUpdate = {
          ...fieldsToUpdate,
          deletedBy: null
        };
      }

      await chatConstants.update(fieldsToUpdate, {
        where: {
          id: chat?.id
        },
      });

      await sequelize.query(
        'UPDATE "chatConstants" SET "updatedAt" = :updatedAt WHERE id = :id',
        {
          replacements: { updatedAt: new Date(), id: chat?.id },
          type: QueryTypes.UPDATE
        }
      );
    }

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.CHAT_CREATED, chat);
  }),

  getAllChats: asyncHandler(async (req, res, next) => {
    const chats = await sequelize.query(
      `
      SELECT 
        c.*,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.id
          ELSE u2.id
        END AS "senderId",
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.name
          ELSE u2.name
        END AS "senderName",
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.email
          ELSE u2.email
        END AS "senderEmail",
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.image
          ELSE u2.image
        END AS "senderImage",
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u2.id
          ELSE u1.id
        END AS "receiverId",
        (
          SELECT "isOnline"
          FROM users u
          WHERE u.id = (
            CASE 
              WHEN c."user1Id" = :loggedInUser THEN u2.id
              ELSE u1.id
            END
          )
        ) AS "isOnline",
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u2.name
          ELSE u1.name
        END AS "receiverName",
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u2.email
          ELSE u1.email
        END AS "receiverEmail",
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u2.image
          ELSE u1.image
        END AS "receiverImage",
        (
          SELECT COUNT(*)
          FROM "chatMessages"
          WHERE "chatId" = c.id
            AND "receiverId" = :loggedInUser
            AND "isRead" = false
            AND "deletedBy" IS DISTINCT FROM :loggedInUser
        ) AS "unreadMessagesCount",
        (
          SELECT message
          FROM "chatMessages"
          WHERE "deletedBy" IS DISTINCT FROM :loggedInUser 
            AND "chatMessages"."chatId" = c.id 
          ORDER BY id DESC LIMIT 1
        ) AS "lastMessage"
      FROM 
        "chatConstants" c
      JOIN 
        users u1 ON c."user1Id" = u1.id
      JOIN 
        users u2 ON c."user2Id" = u2.id
      WHERE 
        (c."user1Id" = :loggedInUser OR c."user2Id" =:loggedInUser) 
        AND (c."deletedBy" IS DISTINCT FROM :loggedInUser) 
      ORDER BY c."updatedAt" DESC
      `,
      {
        replacements: { loggedInUser: req.user.id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.GET_ALL_CHAT, chats);
  }),
  sendMessage: asyncHandler(async (req, res, next) => {
    const { receiverId } = req.params;
    const { message } = req.body;


    let isNewChat = false;

    let chat = await chatConstants.findOne({ // Changed chat_constants to chatConstants
      where: {
        [Op.or]: [
          {
            user1Id: receiverId, // Changed user1_id to user1Id
            user2Id: req.user.id, // Changed user2_id to user2Id
          },
          {
            user1Id: req.user.id, // Changed user1_id to user1Id
            user2Id: receiverId, // Changed user2_id to user2Id
          },
        ],
      },
      raw: true,
    });

    if (!chat) {
      chat = await chatConstants.create({ // Changed chat_constants to chatConstants
        user1Id: req.user.id, // Changed user1_id to user1Id
        user2Id: receiverId, // Changed user2_id to user2Id
      });
    }

    const createMessage = await chatMessages.create({ // Changed chatMessages to chatMessages
      chatId: chat.id, // Changed chat_id to chatId
      senderId: req.user.id, // Changed senderId to senderId
      receiverId: receiverId, // Changed receiverId to receiverId
      message,
      isRead: 0, // Changed is_read to isRead
    });

    const sendMessage = await chatMessages.findOne({ // Changed chatMessages to chatMessages
      where: {
        id: createMessage?.id,
      },
      order: [['createdAt', 'ASC']], // Changed created_at to createdAt
      include: [
        {
          model: users,
          as: 'sender',
          attributes: [
            'id',
            'name',
            ['image', 'senderImage']
          ],
        },
        {
          model: users,
          as: 'receiver',
          attributes: [
            'id',
            'name',
            ['image', 'receiverImage']
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!chat?.lastMessageId || chat?.deletedBy === receiverId) { // Changed last_message_id to lastMessageId and deleted_by to deletedBy
      await chatConstants.update( // Changed chat_constants to chatConstants
        {
          lastMessageId: createMessage?.id, // Changed last_message_id to lastMessageId
          deletedBy: null, // Changed deleted_by to deletedBy
        },
        {
          where: {
            id: chat?.id,
          },
        }
      );

      console.log("NEW CHAT STARTED");
      const newChat = await sequelize.query(
        `
      SELECT 
        c.*,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.id
          ELSE u2.id
        END AS senderId,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.name
          ELSE u2.name
        END AS senderName,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.email
          ELSE u2.email
        END AS senderEmail,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u1.image
          ELSE u2.image
        END AS senderImage,
        CASE 
          WHEN c.user1Id = :loggedInUser THEN u2.id
          ELSE u1.id
        END AS receiverId,
        (
          SELECT isOnline
          FROM users u
          WHERE u.id = (
            CASE 
              WHEN c."user1Id" = :loggedInUser THEN u2.id
              ELSE u1.id
            END
          )
        ) AS isOnline,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u2.name
          ELSE u1.name
        END AS receiverName,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u2.email
          ELSE u1.email
        END AS receiverEmail,
        CASE 
          WHEN c."user1Id" = :loggedInUser THEN u2.image
          ELSE u1.image
        END AS receiverImage,
        (
          SELECT COUNT(*)
          FROM "chatMessages"
          WHERE chatId = c.id
            AND "receiverId" = :loggedInUser
            AND "isRead" = false
            AND "deletedBy" IS DISTINCT FROM :loggedInUser
        ) AS unreadMessagesCount,
        (
          SELECT message
          FROM "chatMessages"
          WHERE "deletedBy" IS DISTINCT FROM :loggedInUser 
            AND "chatMessages".chatId = c.id 
          ORDER BY id DESC LIMIT 1
        ) AS lastMessage
      FROM 
        chatConstants c
      JOIN 
        users u1 ON c."user1Id" = u1.id
      JOIN 
        users u2 ON c."user2Id" = u2.id
      WHERE 
        c.id = ${chat.id}
      `,
        {
          replacements: { loggedInUser: receiverId },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      isNewChat = true;

      emitSocketEvent(req, receiverId.toString(), CHAT_EVENTS.NEW_CHAT, newChat[0]);
    }



    emitSocketEvent(req, receiverId.toString(), CHAT_EVENTS.MESSAGE_RECEIVED_EVENT, {
      ...sendMessage,
      isNewChat: isNewChat, // Changed is_new_chat to isNewChat
    });

    await chatConstants.update( // Changed chat_constants to chatConstants
      {
        lastMessageId: createMessage?.id, // Changed last_message_id to lastMessageId
      },
      {
        where: {
          id: chat?.id,
        },
      }
    );

    setTimeout(async () => {
      const unreadMessages = await getUnreadMessagesCount(receiverId);

      emitSocketEvent(req, receiverId.toString(), CHAT_EVENTS.READ_UNREAD_COUNT, {
        unreadMessages,
      });
    }, 1500);

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.MESSAGE_SENT, sendMessage);
  }),

  getChat: asyncHandler(async (req, res, next) => {
    const { chatId } = req.params;
    const { page, limit } = req.query;



    // const { receiverId } = req.params;
    // const getUser = users.findOne({
    //   where: {
    //     id: receiverId,
    //   },
    //   attributes: [
    //     'isOnline', // Changed is_online to isOnline
    //     'name',
    //     ['image', 'receiverImage'],
    //   ],
    //   raw: true,
    // });

    // const getChatConstant = chatConstants.findOne({ // Changed chat_constants to chatConstants
    //   where: {
    //     [Op.or]: [
    //       {
    //         user1Id: req.user.id, // Changed user1_id to user1Id
    //         user2Id: receiverId, // Changed user2_id to user2Id
    //       },
    //       {
    //         user1Id: receiverId, // Changed user1_id to user1Id
    //         user2Id: req.user.id, // Changed user2_id to user2Id
    //       },
    //     ],
    //   },
    // });

    const chatConstant = await chatConstants.findByPk(chatId, { raw: true });


    // return res.json(chatConstant)

    const receiverId = chatConstant?.user1Id == req.user.id ? chatConstant.user2Id : chatConstant?.user1Id
    const user = await users.findOne({
      where: {
        id: receiverId,
      },
      attributes: [
        'isOnline', // Changed is_online to isOnline
        'name',
        ['image', 'receiverImage'],
      ],
      raw: true,
    });



    const query = {
      where: {
        chatId,
        deletedBy: { // Changed deleted_by to deletedBy
          [Op.or]: [
            { [Op.notIn]: [req.user.id] },
            { [Op.is]: null },
          ],
        },
      },
      include: [
        {
          model: users,
          as: 'sender',
          attributes: [
            'id',
            'name',
            ['image', 'senderImage']
          ],
        },
        {
          model: users,
          as: 'receiver',
          attributes: [
            'id',
            'name',
            [
              'image', 'receiverImage', // Changed receiver_image to receiverImage
            ],
          ],
        },
      ],
    };

    const chat = await getPaginatedResults({
      model: chatMessages, // Changed chatMessages to chatMessages
      page,
      limit,
      where: query.where,
      includeOptions: query.include,
      otherOptions: {
        raw: true,
        order: [['id', 'DESC']],
        nest: true,
      },
    });

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.GET_CHAT, {
      chatId: chatConstant?.id, // Changed chat_id to chatId
      isOnline: user?.isOnline, // Changed is_online to isOnline
      name: user?.name,
      receiverSlug: user?.slug, // Changed receiver_slug to receiverSlug
      receiverImage: user?.receiverImage || '', // Changed receiver_image to receiverImage
      receiverId: receiverId, // Changed receiverId to receiverId
      archivedBy: chatConstant?.archived_by, // Changed archived_by to archivedBy
      chat: {
        ...chat,
        data: chat.data.reverse(),
      },
    });
  }),

  readMessages: asyncHandler(async (req, res, next) => {

    const { chatId } = req.params;
    const currentUserId = req.user.id;

    const chat = await chatConstants.findOne({ // Changed chat_constants to chatConstants
      where: {
        id: chatId,
      },
      raw: true,
    });

    await chatMessages.update({ // Changed chatMessages to chatMessages
      isRead: true, // Changed is_read to isRead
    }, {
      where: {
        receiverId: currentUserId, // Changed receiverId to receiverId
        chatId: chat.id, // Changed chat_id to chatId
      },
    });

    const unreadMessages = await getUnreadMessagesCount(currentUserId);


    // emit the receive message event to the other participants with received message as the payload
    if (unreadMessages === 0) {
      emitSocketEvent(
        req,
        currentUserId.toString(),
        CHAT_EVENTS.READ_UNREAD_COUNT,
        {
          unreadMessages,
        }
      );
    }

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.MESSAGES_READ);
  }),

  getChatsCount: asyncHandler(async (req, res, next) => {
    // c.user1_id = :loggedInUser OR c.user2_id = :loggedInUser AND(c.user2_id =: loggedInUser AND c.last_message_id IS NOT NULL)
    let count = await chatConstants.count({ // Changed chat_constants to chatConstants
      where: {
        [Op.or]: [
          {
            user1Id: req.user.id, // Changed user1_id to user1Id
          },
          {
            user2Id: req.user.id, // Changed user2_id to user2Id
            lastMessageId: { // Changed last_message_id to lastMessageId
              [Op.not]: null,
            },
          },
        ],
        deletedBy: { // Changed deleted_by to deletedBy
          [Op.or]: [
            { [Op.notIn]: [req.user.id] },
            { [Op.is]: null },
          ],
        },
      },
      raw: true,
    });

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS, { count });
  }),

  deleteChat: asyncHandler(async (req, res, next) => {
    const loggedInUser = req.user.id;
    const chatId = req.params.id;

    const chat = await chatConstants.findByPk(chatId); // Changed chat_constants to chatConstants

    if (!chat) {
      return next(new AppError("Invalid chat id", STATUS_CODES.BAD_REQUEST));
    }

    if (!chat?.deletedBy) { // Changed deleted_by to deletedBy
      const updateConstants = chatConstants.update({ // Changed chat_constants to chatConstants
        deletedBy: loggedInUser, // Changed deleted_by to deletedBy
      }, {
        where: {
          id: chatId,
        },
      });

      const updateArchieveBy = await sequelize.query(
        `UPDATE chat_constants
      SET archived_by = array_remove(archived_by, :loggedInUser)
      WHERE id = :recordId;`,
        {
          replacements: { recordId: chatId, loggedInUser },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      const updateMessages = chatMessages.update({ // Changed chatMessages to chatMessages
        deletedBy: loggedInUser, // Changed deleted_by to deletedBy
      }, {
        where: {
          chatId, // Changed chat_id to chatId
        },
      });

      await Promise.all([updateConstants, updateMessages, updateArchieveBy]);
    } else {
      await chatConstants.destroy({ // Changed chat_constants to chatConstants
        where: {
          id: chatId,
        },
      });
    }

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.DELETE_CHAT, chat);
  }),

  editMessage: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { message } = req.body;

    const findMessage = await chatMessages.findByPk(id); // Changed chatMessages to chatMessages

    if (!findMessage) {
      return next(new AppError(RESPONSE_MSGS.ERROR.INVALID_ID, STATUS_CODES.BAD_REQUEST));
    }

    await chatMessages.update({ // Changed chatMessages to chatMessages
      message,
      isEdited: true, // Changed is_edited to isEdited
    }, {
      where: {
        id,
      },
    });

    emitSocketEvent(
      req,
      findMessage?.receiverId?.toString(), // Changed receiverId to receiverId
      CHAT_EVENTS.MESSAGE_EDITED,
      {
        id,
        isEdited: true, // Changed is_edited to isEdited
        message,
      }
    );

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.MESSAGE_EDITED);
  }),


};
