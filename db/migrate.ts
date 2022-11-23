import { DataSource, QueryRunner } from 'typeorm'
import * as fs from 'fs'
import * as dotenv from 'dotenv'


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


async function executeSingleSQLFile(filepath: string,  queryRunner: QueryRunner){
	const migrationSQL = fs.readFileSync(filepath, 'utf8')	
	await queryRunner.startTransaction()
	await queryRunner.query(migrationSQL)
	await queryRunner.commitTransaction()
}

async function unapplyMigrationsFrom(dataSource: DataSource, version: number, count?: number){
	// Build list of migrations and filter out non migration folders
	const allMigrationNames = fs.readdirSync('migrations', {withFileTypes: true} ).filter((item) => item.isDirectory() && isNaN(+item.name.substring(0,item.name.indexOf('-')))).map((item)=> item.name)
	const appliedMigrations = allMigrationNames.filter((item)=> +item.substring(0, item.indexOf('-')) <= version).sort((a, b) => b.localeCompare((a))) 
	let unAppliedMigrationCount = 0
	const queryRunner = dataSource.createQueryRunner()
	for (const migration of appliedMigrations){
		if (count){
			if (unAppliedMigrationCount >= count){
				break;
			}
		}
		await executeSingleSQLFile(`migrations/${migration}/DOWN.sql`, queryRunner)
		await queryRunner.query(`DELETE FROM migration_state WHERE version = (${+migration.substring(0, migration.indexOf('-'))})`)
		console.log(`"Unapplied" ${migration}`)
		unAppliedMigrationCount++
	}
}

async function applyMigrationsFrom(dataSource: DataSource, version : number, count?: number){
	// Build list of migrations and filter out non migration folders
	const allMigrationNames = fs.readdirSync('migrations', {withFileTypes: true} ).filter((item) => item.isDirectory() && isNaN(+item.name.substring(0,item.name.indexOf('-')))).map((item)=> item.name)
	const nonAppliedMigrations = allMigrationNames.filter((item)=> +item.substring(0, item.indexOf('-')) > version).sort() // Strings start with (unique) number, therefore default sorting is fine
	let appliedMigrationCount = 0
	const queryRunner = dataSource.createQueryRunner()
	// Before starting,create necessary table if not exists 
await queryRunner.query(`CREATE TABLE IF NOT EXISTS migration_state(version integer)`)	
	for (const migration of nonAppliedMigrations){
		if (count){
			if (appliedMigrationCount >= count){
				break;
			}
		}
		await executeSingleSQLFile(`migrations/${migration}/UP.sql`, queryRunner)
		await queryRunner.query(`INSERT INTO migration_state(version) VALUES (${+migration.substring(0, migration.indexOf('-'))})`)
		console.log(`Applied ${migration}`)
		appliedMigrationCount++
	}	
}


async function getCurrentState(dataSource: DataSource): Promise<number> {
	const version_number: number = (await dataSource.query('SELECT MAX(version_number::int) AS version FROM migration_state'))[0]?.version
	return version_number ?? 0
}

async function findMigrationNameForVersion(version: number){
	const name =  fs.readdirSync('migrations', {withFileTypes: true} ).filter((item) => item.isDirectory() && item.name.substring(0,item.name.indexOf('-')) === version.toString()).map((item)=> item.name)
	if (name.length === 0){
		throw new Error('Verison number does not have corresponding migration in clientFolder')
	}
	return name[0]
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

async function main(args: string[]){
	const sourceDB = connectToDb()
	const currentState = await getCurrentState(sourceDB)
	const mode = args[0]
	switch(mode){
		case 'create':
			console.log('Create Migration')
			const name = args[1]
			createNewMigration(name)
			break	
		case 'up':
			console.log('Applying migrations')
			applyMigrationsFrom(sourceDB, currentState)
			break
		case 'next':
			console.log('Applying one migration')
			applyMigrationsFrom(sourceDB,currentState, 1)
			break
		case 'down':
			console.log('Unapplying migrations')
			unapplyMigrationsFrom(sourceDB, currentState)
			break
		case 'prev':
			console.log('Unapplying one migration')
			unapplyMigrationsFrom(sourceDB, currentState, 1)
			break
		case 'status':
			const migrationName = findMigrationNameForVersion(currentState)
			console.log(`Currently at version number ${currentState} which corresponds to migration ${migrationName} `)
			break
		default:
			console.log('Invalid input')
			
			
	}
}

// Remove generic arguments
const args = process.argv.splice(2)
dotenv.config()
main(args)
