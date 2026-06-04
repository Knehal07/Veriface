import * as Keychain from "react-native-keychain";

const SERVICE_PREFIX = "VeriFaceSecureStorage";

export async function secureSetItem(key: string, value: string) {
  await Keychain.setGenericPassword(key, value, {
    service: `${SERVICE_PREFIX}.${key}`,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
  });
}

export async function secureGetItem(key: string): Promise<string | null> {
  const result = await Keychain.getGenericPassword({
    service: `${SERVICE_PREFIX}.${key}`
  });

  if (!result) {
    return null;
  }

  return result.password;
}

export async function secureRemoveItem(key: string) {
  await Keychain.resetGenericPassword({
    service: `${SERVICE_PREFIX}.${key}`
  });
}