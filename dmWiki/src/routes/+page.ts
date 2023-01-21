// @ts-ignore
import segow from 'segow';

export const prerender = true;
export const csr = false;

export async function load() {
	const news = await segow.queryWiki(`events.day == 0; .description`);
	const hank = (await segow.queryWiki(`npc.name === "Hank Zant"`))[0][0];
	const rabbit = (await segow.queryWiki(`npc.name === "The White Rabbit"`))[0][0];
	const price = JSON.stringify(await segow.queryWiki(`.dailyWages !== undefined`))
	const mandate = (await segow.queryWiki("mandatePeriod !== undefined"))
	console.log(mandate)
	return {
		news,
		cards: [
			{ title: hank.name, text: hank.description, width: 2, height: 2 },
			{ title: "wages", text: price, width: 1, height: 1 },
			{ title: rabbit.name, text: rabbit.description, width: 3, height: 1 }
		]
	};
}
