import quadTree from '$lib/quadTree.js';
import mongo from '$lib/mongo';
import { logger } from '$lib/logger';

async function getCampaign(name) {
	return await mongo.collection('campaign').then((collection) =>
		collection.findOne({
			name: name
		})
	);
}

export const get = async (page) => {
	let name = page.query.get('campaign') || 'segow';
	logger.info(`fetching campaign=${name}`);
	let campaign = await getCampaign(name);
	if (!campaign) {
		await mongo.collection('campaign').then((collection) =>
			collection.updateOne(
				{
					name
				},
				{ $set: { tree: quadTree.tree(0, 0, 10, 10) } },
				{ upsert: true }
			)
		);
		campaign = await getCampaign(name);
	}
	return {
		body: campaign
	};
};

export const put = async (req) => {
	let name = req.query.get('campaign') || 'segow';

	logger.info(`updating campaign=${name}, with entity=${JSON.stringify(req.body)}`);
	let campaign = await mongo.collection('campaign').then((collection) =>
		collection.findOne({
			name
		})
	);
	let newTree = quadTree.addRect(campaign.tree, req.body);
	await mongo.collection('campaign').then((collection) =>
		collection.updateOne(
			{
				name
			},
			{ $set: { tree: newTree } },
			{ upsert: true }
		)
	);
	return {
		status: 200,
		body: {}
	};
};
