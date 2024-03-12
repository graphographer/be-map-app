import dsv from '@rollup/plugin-dsv';

const parseMoney = /^(\-)?\$(\d{1,3}(,\d{3})*(\.\d+)?)$/;

export const disbursementByAgencyProcessor = dsv({
	include: 'src/data/disbursement_by_agency.csv',
	processRow(_row) {
		const row: any = { ..._row };

		const Disbursements: [number, number][] = [];

		for (const key in row) {
			if (!key.startsWith('Disbursement - FY')) continue;

			const FY = parseInt(key.replace('Disbursement - FY', '20'));

			Disbursements.unshift([
				FY,
				row[key].startsWith('$ -')
					? 0
					: parseFloat(row[key].replace(parseMoney, '$1$2').replaceAll(',', ''))
			]);

			delete row[key];
		}

		row.Disbursements = Disbursements;

		return row;
	}
});
