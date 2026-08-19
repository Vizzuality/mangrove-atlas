import NodeView from '@/containers/catalog/node-view';

export default async function CatalogNodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NodeView slug={slug} />;
}
