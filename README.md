# @pipeworx/mcp-nobel

MCP server for Nobel Prize data — laureates and prizes by year and category. Wraps the [Nobel Prize API v2](https://www.nobelprize.org/about/developer-zone-2/) (free, no auth required).

## Tools

| Tool | Description |
|------|-------------|
| `search_laureates` | Search Nobel Prize laureates by name and/or category |
| `get_prizes_by_year` | Get all Nobel Prizes awarded in a specific year |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "nobel": {
      "url": "https://gateway.pipeworx.io/nobel/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use nobel
```

## License

MIT
