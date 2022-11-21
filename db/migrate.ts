import { DataSource } from 'typeorm'
import * as fs from 'fs'
const dotenv = require('dotenv')

function createNewMigration( name: string){
	if (!name){
		throw new Error('No migration name required. The migration name is mandatory and should be descriptive')
	}
	const migrationName: string = `${(Date.now() / 1000 | 0).toString()}-${name}` // Bitwise or to floor => unix timestamp for current time 
	fs.mkdirSync(`migrations/${migrationName}`, {recursive: true}) // Recursive in case migrations folder does not exist yet
	fs.writeFileSync(`migrations/${migrationName}/UP.sql`,`-- UP migration file for migration ${migrationName} `)
	fs.writeFileSync(`migrations/${migrationName}/DOWN.sql`,`-- DOWN migration file for migration ${migrationName} `)
	fs.writeFileSync(`migrations/${migrationName}/changelog.md`, `# ${migrationName} - Changelog`)
	console.log(`Created migration files for ${migrationName}`)
}


async function getCurrentState(dataSource: DataSource): Promise<number> {
	const version_number: number = (await dataSource.query('SELECT MAX(version_number::int) AS version FROM migration_state'))[0].version
	return version_number ?? 0
}


function connectToDb(): DataSource{
	return new DataSource({
		port: parseInt(process.env.DB_PORT as string),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PW,
		host: process.env.DB_HOST,
		type: 'postgres',
		database: process.env.DB_DB
	})
}

function main(args: string[]){
	const sourceDB = connectToDb()
	const currentState = getCurrentState(sourceDB)
	const mode = args[0]
	let parameters = []
	if (args.length > 1){
		parameters = args.splice(1)
	}
	switch(mode){
		case 'create':
			console.log('Create Migration')
			const name = args[1]
			createNewMigration(name)
			break	
		case 'up':

		case 'down':
		case 'status':
		default:
			
	}
}

// Remove generic arguments
const args = process.argv.splice(2)
dotenv.config()
main(args)
