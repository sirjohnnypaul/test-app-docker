import * as bcrypt from 'bcrypt';

export class PasswordsUtils {
  private static HASH_ROUNDS: number = 10;
  static hashPassword(myPassword: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.hash(myPassword, this.HASH_ROUNDS, (err: Error, hash: string) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  static async comparePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) =>
      bcrypt.compare(oldPassword, newPassword, (err: Error, same: boolean) => {
        if (err) {
          reject(err);
        }

        resolve(same);
      }),
    );
  }
}
