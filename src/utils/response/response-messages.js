const RESPONSE_MSGS = {
  SUCCESS: {
    DEFAULT: {
      message: {
        en: 'Success',
        ge: 'Erfolg',
      },
    },
    CHAT_CREATED: {
      message: {
        en: 'Chat created successfully.',
        ge: 'Erfolg',
      },
    },
    GET_ALL_CHAT: {
      message: {
        en: 'All chats get successfully.',
        ge: 'Erfolg',
      },
    },
    MESSAGE_SENT: {
      message: {
        en: 'All chats get successfully.',
        ge: 'Erfolg',
      },
    },
    GET_CHAT: {
      message: {
        en: 'All chats get successfully.',
        ge: 'Erfolg',
      },
    },
    MESSAGES_READ: {
      message: {
        en: 'Messaged read successfully.',
        ge: 'Erfolg',
      },
    },
    DELETE_CHAT: {
      message: {
        en: 'Chat deleted successfully',
        ge: 'Erfolg',
      },
    },
    MESSAGE_EDITED: {
      message: {
        en: 'Message edited successfylly.',
        ge: 'Erfolg',
      },
    },

  },
  ERROR: {
    DEFAULT: {
      message: {
        en: 'Error',
        ge: ' تم الإنشاء بنجاح ',
      },
      type: 'DEFAULT',
    },
    USER_NOT_AVAILABLE: {
      message: {
        en: 'This user is no longer available.',
        ge: 'Erfolg',
      },
    },
    INVALID_ID: {
      message: {
        en: 'Invalid Id.',
        ge: 'Erfolg',
      },
    },
    INVALID_TOKEN: {
      message: {
        en: 'Invalid Token',
        ge: 'Erfolg',
      },
    },
    INVALID_CHAT_TOKEN: {
      message: {
        en: 'Invalid Chat Token.',
        ge: 'Erfolg',
      },
    },
    TOKEN_MISSING: {
      message: {
        en: 'Token missing.',
        ge: 'Erfolg',
      },
    },
    UNAUTHORIZED: {
      message: {
        en: 'Unauthorized',
        ge: 'Erfolg',
      },
    },
  },
};

module.exports = { RESPONSE_MSGS };
