"""Database Migration Planner - Plans database migrations using grounding."""

from typing import Dict, Any
from app.integrations.gemini import generate_with_grounding


async def plan_database_migration(
    source_db: str,
    target_db: str,
    schema_info: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Plan a database migration using web search grounding.
    
    Args:
        source_db: Source database (e.g., "MySQL", "MongoDB")
        target_db: Target database (e.g., "PostgreSQL", "DynamoDB")
        schema_info: Schema information from analysis
    
    Returns:
        Migration plan with strategy, tools, and steps
    """
    
    # Build search prompt
    prompt = f"""Plan a migration from {source_db} to {target_db}.

Schema information:
{_format_schema(schema_info)}

Search for and provide:

1. **Migration Tools**: What are the best tools for {source_db} to {target_db} migration?
2. **Data Type Mappings**: How do {source_db} types map to {target_db} types?
3. **Feature Compatibility**: What {source_db} features need special handling in {target_db}?
4. **Migration Strategy**: What's the recommended approach (dump/restore, streaming, ETL)?
5. **Potential Issues**: Common pitfalls and how to avoid them
6. **Step-by-Step Plan**: Concrete steps to execute this migration

Be specific and actionable. Include exact commands and tool names."""
    
    print(f"🔍 [DB Planner] Searching for {source_db} → {target_db} migration strategy...")
    
    try:
        result = await generate_with_grounding(
            prompt=prompt,
            system_instruction=f"You are a database migration expert. Search for official migration guides, tools, and best practices for {source_db} to {target_db} migrations. Provide concrete, actionable steps."
        )
        
        migration_plan = result['text']
        sources = result['grounding_metadata'].get('sources', [])
        
        print(f"💡 [DB Planner] Found migration strategy from {len(sources)} sources")
        
        # Format response
        return {
            "source_database": source_db,
            "target_database": target_db,
            "migration_strategy": migration_plan,
            "sources": [
                {
                    "title": src.get('title', 'Unknown'),
                    "url": src.get('uri', '')
                }
                for src in sources[:5]
            ],
            "type": "database_migration"
        }
        
    except Exception as e:
        print(f"⚠️ [DB Planner] Grounding failed: {e}")
        return {
            "source_database": source_db,
            "target_database": target_db,
            "migration_strategy": f"Error: Unable to generate migration plan. {str(e)}",
            "sources": [],
            "type": "database_migration"
        }


def _format_schema(schema_info: Dict[str, Any]) -> str:
    """Format schema info for prompt."""
    if not schema_info:
        return "No schema information available"
    
    # Extract relevant schema details
    formatted = []
    
    if 'tables' in schema_info:
        formatted.append(f"Tables: {', '.join(schema_info['tables'])}")
    
    if 'collections' in schema_info:
        formatted.append(f"Collections: {', '.join(schema_info['collections'])}")
    
    if 'indexes' in schema_info:
        formatted.append(f"Indexes: {len(schema_info['indexes'])}")
    
    return "\n".join(formatted) if formatted else "Schema details not provided"


def is_database_migration(source_stack: str, target_stack: str) -> bool:
    """Check if this is a database migration."""
    databases = [
        'mysql', 'postgresql', 'postgres', 'mongodb', 'dynamodb',
        'redis', 'cassandra', 'mariadb', 'sqlite', 'oracle',
        'mssql', 'sql server', 'firestore', 'couchdb'
    ]
    
    source_lower = source_stack.lower()
    target_lower = target_stack.lower()
    
    source_is_db = any(db in source_lower for db in databases)
    target_is_db = any(db in target_lower for db in databases)
    
    return source_is_db and target_is_db
