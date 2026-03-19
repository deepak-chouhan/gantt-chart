import { env } from "../config/env.js";
import { resend } from "../config/resend.js";

interface SendInviteEmailOptions {
  toEmail: string;
  teamName: string;
  invitedByName: string;
  inviteUrl: string;
}

export const sendInviteEmail = async ({
  toEmail,
  teamName,
  invitedByName,
  inviteUrl,
}: SendInviteEmailOptions) => {
  await resend.emails.send({
    from: `Gantt App ${env.invite.email}`,
    to: toEmail,
    subject: `${invitedByName} invited you to join ${teamName}`,
    html: `<a href="${inviteUrl}">Accept Invite</a>`,
  });
};
