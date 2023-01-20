// @ts-ignore
import segow from 'segow';

export const prerender = true;
export const csr = false;

export async function load() {
	const news = await segow.queryWiki(`events.day == 1; .description`);
	const npc = (await segow.queryWiki(`npc.name === "Hank Zant"; .description`))[0];
	return {
		news,
		cards: [{ title: 'Hank Zant', text: npc, width: 2, height: 2 }]
	};
}
