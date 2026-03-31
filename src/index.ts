interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Nobel MCP — wraps the Nobel Prize API v2 (free, no auth)
 *
 * Tools:
 * - search_laureates: search Nobel Prize laureates by name or category
 * - get_prizes_by_year: list all prizes awarded in a given year
 */


const BASE_URL = 'https://api.nobelprize.org/2.1';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_laureates',
    description:
      'Search Nobel Prize laureates by name and/or prize category. Returns biography, prizes won, and motivation.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Full or partial name of the laureate (e.g., "Einstein", "Marie Curie")',
        },
        category: {
          type: 'string',
          description:
            'Nobel Prize category: phy (Physics), che (Chemistry), med (Medicine), lit (Literature), pea (Peace), eco (Economics)',
        },
      },
    },
  },
  {
    name: 'get_prizes_by_year',
    description:
      'Get all Nobel Prizes awarded in a specific year, optionally filtered by category.',
    inputSchema: {
      type: 'object',
      properties: {
        year: {
          type: 'number',
          description: 'Year to look up (e.g., 2023). Must be 1901 or later.',
        },
        category: {
          type: 'string',
          description:
            'Nobel Prize category: phy (Physics), che (Chemistry), med (Medicine), lit (Literature), pea (Peace), eco (Economics)',
        },
      },
      required: ['year'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_laureates':
      return searchLaureates(args.name as string | undefined, args.category as string | undefined);
    case 'get_prizes_by_year':
      return getPrizesByYear(args.year as number, args.category as string | undefined);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchLaureates(name?: string, category?: string) {
  const params = new URLSearchParams({ limit: '20', format: 'json' });
  if (name) params.set('name', name);
  if (category) params.set('nobelPrizeCategory', category);

  const res = await fetch(`${BASE_URL}/laureates?${params}`);
  if (!res.ok) throw new Error(`Nobel API error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    laureates?: {
      id: string;
      knownName?: { en?: string };
      fullName?: { en?: string };
      born?: string;
      died?: string;
      bornCountry?: { en?: string };
      gender?: string;
      nobelPrizes?: {
        awardYear: string;
        category?: { en?: string };
        categoryFullName?: { en?: string };
        motivation?: { en?: string };
        prizeStatus?: string;
      }[];
      wikipedia?: { english?: string };
    }[];
    meta?: { count: number };
  };

  if (!data.laureates || data.laureates.length === 0) {
    return { count: 0, laureates: [] };
  }

  return {
    count: data.meta?.count ?? data.laureates.length,
    laureates: data.laureates.map((l) => ({
      id: l.id,
      name: l.knownName?.en ?? l.fullName?.en ?? null,
      full_name: l.fullName?.en ?? null,
      born: l.born ?? null,
      died: l.died ?? null,
      birth_country: l.bornCountry?.en ?? null,
      gender: l.gender ?? null,
      wikipedia: l.wikipedia?.english ?? null,
      prizes: (l.nobelPrizes ?? []).map((p) => ({
        year: p.awardYear,
        category: p.category?.en ?? null,
        category_full: p.categoryFullName?.en ?? null,
        motivation: p.motivation?.en ?? null,
        status: p.prizeStatus ?? null,
      })),
    })),
  };
}

async function getPrizesByYear(year: number, category?: string) {
  const params = new URLSearchParams({
    nobelPrizeYear: String(year),
    format: 'json',
    limit: '20',
  });
  if (category) params.set('nobelPrizeCategory', category);

  const res = await fetch(`${BASE_URL}/nobelPrizes?${params}`);
  if (!res.ok) throw new Error(`Nobel API error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    nobelPrizes?: {
      awardYear: string;
      category?: { en?: string };
      categoryFullName?: { en?: string };
      dateAwarded?: string;
      prizeMotivation?: { en?: string };
      prizeAmount?: number;
      laureates?: {
        id?: string;
        knownName?: { en?: string };
        fullName?: { en?: string };
        motivation?: { en?: string };
        portion?: string;
      }[];
    }[];
    meta?: { count: number };
  };

  if (!data.nobelPrizes || data.nobelPrizes.length === 0) {
    return { year, count: 0, prizes: [] };
  }

  return {
    year,
    count: data.nobelPrizes.length,
    prizes: data.nobelPrizes.map((p) => ({
      category: p.category?.en ?? null,
      category_full: p.categoryFullName?.en ?? null,
      date_awarded: p.dateAwarded ?? null,
      motivation: p.prizeMotivation?.en ?? null,
      prize_amount_sek: p.prizeAmount ?? null,
      laureates: (p.laureates ?? []).map((l) => ({
        id: l.id ?? null,
        name: l.knownName?.en ?? l.fullName?.en ?? null,
        motivation: l.motivation?.en ?? null,
        portion: l.portion ?? null,
      })),
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
