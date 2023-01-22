import { DataSource, QueryRunner } from 'typeorm'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import chalk from 'chalk'

function createNewMigration( name: string){
	if (!name){
		throw new Error(chalk.red('No migration name provided. The migration name is mandatory and should be descriptive'))
	}
	const migrationName: string = `${(Date.now() / 1000 | 0).toString()}-${name}` // Bitwise or to floor => unix timestamp for current time 
	fs.mkdirSync(`migrations/${migrationName}`, {recursive: true}) // Recursive in case migrations folder does not exist yet
	fs.writeFileSync(`migrations/${migrationName}/UP.sql`,`-- UP migration file for migration ${migrationName} `)
	fs.writeFileSync(`migrations/${migrationName}/DOWN.sql`,`-- DOWN migration file for migration ${migrationName} `)
	fs.writeFileSync(`migrations/${migrationName}/changelog.md`, `# ${migrationName} - Changelog`)
	console.log(`Created migration files for ${chalk.blue(migrationName)}`)
}


async function executeSingleSQLFile(filepath: string,  queryRunner: QueryRunner){
	const migrationSQL = fs.readFileSync(filepath, 'utf8')	
	await queryRunner.startTransaction()
	await queryRunner.query(migrationSQL)
	await queryRunner.commitTransaction()
}

async function unapplyMigrationsFrom(dataSource: DataSource, version: number, count?: number){
	// Build list of migrations and filter out non migration folders
	const allMigrationNames = fs.readdirSync('migrations', {withFileTypes: true} ).filter((item) => item.isDirectory() && !isNaN(+item.name.substring(0,item.name.indexOf('-')))).map((item)=> item.name)
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
		console.log(`"Unapplied" ${chalk.blue(migration)}`)
		unAppliedMigrationCount++
	}
}

async function applyMigrationsFrom(dataSource: DataSource, version : number, count?: number){
	// Build list of migrations and filter out non migration folders
	const allMigrationNames = fs.readdirSync('migrations', {withFileTypes: true} ).filter((item) => item.isDirectory() && !isNaN(+item.name.substring(0,item.name.indexOf('-')))).map((item)=> item.name)
	const nonAppliedMigrations = allMigrationNames.filter((item)=> +item.substring(0, item.indexOf('-')) > version).sort() // Strings start with (unique) number, therefore default sorting is fine
	let appliedMigrationCount = 0
	const queryRunner = dataSource.createQueryRunner()
	// Before starting,create necessary table if not exists 
	await queryRunner.query(`CREATE TABLE IF NOT EXISTS migration_state(version integer)`)
	for (const migration of nonAppliedMigrations){
		console.log(migration)
		if (count){
			if (appliedMigrationCount >= count){
				break;
			}
		}
		await executeSingleSQLFile(`migrations/${migration}/UP.sql`, queryRunner)
		await queryRunner.query(`INSERT INTO migration_state(version) VALUES (${+migration.substring(0, migration.indexOf('-'))})`)
		console.log(`Applied ${chalk.blue(migration)}`)
		appliedMigrationCount++
	}	
}


async function getCurrentState(dataSource: DataSource): Promise<number> {
	let version_number: number = 0
	try{
	 version_number = (await dataSource.query('SELECT MAX(version::int) AS version FROM migration_state'))[0]?.version
	} catch(e: any){
		if (e.code === '42P01'){
			console.log(chalk.red('DB does not seem to have a migration_state table, defaulting to version number 0'))
		}else{
			throw e
		}
	}
	return version_number ?? 0
}

async function findMigrationNameForVersion(version: number){
	const name =  fs.readdirSync('migrations', {withFileTypes: true} ).filter((item) => item.isDirectory() && item.name.substring(0,item.name.indexOf('-')) === version.toString()).map((item)=> item.name)
	if (name.length === 0){
		throw new Error(chalk.red('Verison number does not have corresponding migration in clientFolder'))
	}
	return name[0]
}


async function connectToDb(): Promise<DataSource>{
	const db = new DataSource({
		port: parseInt(process.env.DB_PORT as string),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PW,
		host: process.env.DB_HOST,
		type: 'postgres',
		database: process.env.DB_DB
	})
	await db.initialize()
	return db
}

async function main(args: string[]){
	const mode = args[0]
	if (mode === 'help'){
		console.log(chalk.magentaBright('VERY GOOD AND BUHGFREE MIGRATION SOLUTION (v0.1)'))
		console.log('')
		console.log(` ${chalk.blue('create')} - Create a new migration. A name must be provided`)
		console.log(` ${chalk.blue('status')} - Get current migration status of DB`)
		console.log(` ${chalk.blue('up')}     - Apply all missing migrations`)
		console.log(` ${chalk.blue('next')}   - Apply next migration`)	
		console.log(` ${chalk.blue('down')}   - Revert all applied migrations`)
		console.log(` ${chalk.blue('prev')}   - Revert last migration`)
		process.exit(0)
	}
	const sourceDB = await connectToDb()
	const currentState = await getCurrentState(sourceDB)
	switch(mode){
		case 'create':
			console.log(chalk.blue('Create Migration'))
			const name = args[1]
			createNewMigration(name)
			console.log(chalk.green('Ending sucessfully'))
			break	
		case 'up':
			console.log(chalk.blue('Applying migrations'))
			await applyMigrationsFrom(sourceDB, currentState)
			console.log(chalk.green('All migrations applied, DB is on most recent version'))
			break
		case 'next':
			console.log(chalk.blue('Applying one migration'))
			await applyMigrationsFrom(sourceDB,currentState, 1)
			console.log(chalk.green('Applied next migration sucessfully'))
			break
		case 'down':
			console.log(chalk.blue('Unapplying migrations'))
			await unapplyMigrationsFrom(sourceDB, currentState)
			console.log(chalk.green('Unapplied all migrations. DB should be at initial version'))
			break
		case 'prev':
			console.log(chalk.blue('Unapplying one migration'))
			 await unapplyMigrationsFrom(sourceDB, currentState, 1)
			 console.log(chalk.green('Unapplied one migration.'))
			break
		case 'status':
			if (currentState != 0){
				const migrationName = await findMigrationNameForVersion(currentState)
				console.log(chalk.blue(`Currently at version number ${currentState} which corresponds to migration ${migrationName} `))
			}else{
				console.log(chalk.blue('Currently at version 0, which means no migrations have been applied/no migration state exists in the db'))
			}
			break
		default:
			console.log(chalk.red('Invalid input')+' use help to see possible arguments')
				
	}
	sourceDB.destroy()
}

// Remove generic arguments
const args = process.argv.splice(2)
dotenv.config()
main(args)
