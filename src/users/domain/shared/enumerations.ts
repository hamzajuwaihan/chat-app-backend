export enum PermissionType {
  PRIVATE_MESSAGES = 'privateMessages',
  MEDIA_RECEPTION = 'mediaReception',
  VOICE_CALLS = 'voiceCalls',
  VIDEO_CALLS = 'videoCalls',
}

export enum UserStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  AWAY = 'away',
}

export enum PrivacySettingType {
  ALL = 'all',
  FRIENDS_ONLY = 'friends-only',
  SPECIFIC_USERS = 'specific-users',
  NO_ONE = 'no-one',
}
