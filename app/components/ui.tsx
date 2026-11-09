import Link from "next/link";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiEye, mdiFilterVariant, mdiInboxOutline, mdiLoading, mdiMagnify, mdiPencil, mdiPlus, mdiTrashCan } from "@mdi/js";

/** Title, short description and the main action of a page. Every list and form page starts with this. */
export function PageHeader({ title, description, actions, backHref }: { title: string; description?: string; actions?: React.ReactNode; backHref?: string }) {
  return (
    <div className="page-header">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {(actions || backHref) && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          {backHref && (
            <Link href={backHref} className="btn btn-neutral">
              <Icon path={mdiArrowLeft} size={0.8} />
              Kembali
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function AddButton({ href, label = "Tambah Baru" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="btn btn-primary">
      <Icon path={mdiPlus} size={0.8} />
      {label}
    </Link>
  );
}

/** Search field with its button, the same on every list page. */
export function SearchBox({ value, onChange, onSubmit, placeholder }: { value: string; onChange: (value: string) => void; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; placeholder: string }) {
  return (
    <form onSubmit={onSubmit} role="search" className="flex w-full max-w-md items-stretch">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="form-input flex-1 rounded-r-none"
      />
      <button type="submit" aria-label="Cari" className="btn btn-primary rounded-l-none px-4">
        <Icon path={mdiMagnify} size={0.9} />
      </button>
    </form>
  );
}

/** Search on the left, filter on the right. */
export function ListToolbar({ search, onFilter }: { search: React.ComponentProps<typeof SearchBox>; onFilter?: () => void }) {
  return (
    <div className="toolbar">
      <SearchBox {...search} />
      {onFilter && (
        <button type="button" onClick={onFilter} className="btn btn-outline">
          <Icon path={mdiFilterVariant} size={0.9} />
          Filter
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-600 dark:bg-gray-800">
      <span className="flex size-14 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-gray-700">
        <Icon path={mdiInboxOutline} size={1.5} />
      </span>
      <h2 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h2>
      {description && <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );
}

export function LoadingState({ label = "Memuat data..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-14 text-gray-500 dark:text-gray-400">
      <Icon path={mdiLoading} size={1.6} className="animate-spin text-orange-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Edit and delete at the bottom of a card: same look and same size on every list. */
export function CardActions({ editHref, onDelete, disabled, onView, viewLabel = "Lihat" }: { editHref: string; onDelete: () => void; disabled?: boolean; onView?: () => void; viewLabel?: string }) {
  return (
    <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
      {onView && (
        <button type="button" onClick={onView} className="btn btn-sm btn-ghost col-span-2">
          <Icon path={mdiEye} size={0.7} />
          {viewLabel}
        </button>
      )}
      <Link href={editHref} className="btn btn-sm btn-outline">
        <Icon path={mdiPencil} size={0.7} />
        Edit
      </Link>
      <button type="button" onClick={onDelete} disabled={disabled} className="btn btn-sm btn-danger">
        <Icon path={mdiTrashCan} size={0.7} />
        Hapus
      </button>
    </div>
  );
}

/** Icon buttons for table rows. */
export function RowActions({ editHref, onDelete, disabled }: { editHref: string; onDelete: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={editHref} title="Edit" aria-label="Edit" className="icon-btn text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700">
        <Icon path={mdiPencil} size={0.85} />
      </Link>
      <button type="button" onClick={onDelete} disabled={disabled} title="Hapus" aria-label="Hapus" className="icon-btn text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-gray-700">
        <Icon path={mdiTrashCan} size={0.85} />
      </button>
    </div>
  );
}
