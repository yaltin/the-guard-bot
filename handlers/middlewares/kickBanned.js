'use strict';

const dedent = require('dedent-js');

// Utils
const { link } = require('../../utils/tg');
const { logError } = require('../../utils/log');

const { replyOptions } = require('../../bot/options');

const errorDescriptions = {
	banAdmin: 'Bad Request: user is an administrator of the chat',
};

const kickBannedHandler = async (ctx, next) => {
	if (ctx.chat.type === 'private') {
		return next();
	}
	if (ctx.from.status === 'banned') {
		try {
			await ctx.kickChatMember(ctx.from.id);
		} catch (err) {
			if (err.description !== errorDescriptions.banAdmin) {
				logError(err);
			}
			return next();
		}
		ctx.deleteMessage();
		return ctx.replyWithHTML(
			dedent(`
			🚫 ${link(ctx.from)} <b>is banned</b>!

			Reason: ${ctx.from.ban_reason}`),
			replyOptions
		);
	}
	return next();
};

module.exports = kickBannedHandler;
