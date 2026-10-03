import { useState } from "react"
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  History,
  PackageCheck,
  PackageOpen,
  PackageX,
  RefreshCw,
  ShieldAlert,
} from "lucide-react"
import DataTable from "../components/ui/DataTable"
import FilterBar, { SelectFilter } from "../components/ui/FilterBar"
import KpiCard from "../components/ui/KpiCard"
import PageHeader from "../components/ui/PageHeader"
import type { Page } from "../types"

const TABS_MAP: Record<string, string> = {
  inventory: "overview",
  "inventory-parts": "items",
  "inventory-stock": "stock",
  "inventory-movements": "movements",
}

const ITEM_COLUMNS = [
  { key: "code", label: "Item Code" },
  { key: "name", label: "Item Name" },
  { key: "category", label: "Category" },
  { key: "unit", label: "Unit" },
  { key: "partNumber", label: "Part Number" },
  { key: "criticality", label: "Criticality" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
]

const LOW_STOCK_COLUMNS = [
  { key: "name", label: "Item" },
  { key: "code", label: "Item Code" },
  { key: "category", label: "Category" },
  { key: "store", label: "Store" },
  { key: "available", label: "Available" },
  { key: "reserved", label: "Reserved" },
  { key: "reorderLevel", label: "Reorder Level" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
]

const OUT_OF_STOCK_COLUMNS = [
  { key: "name", label: "Item" },
  { key: "code", label: "Item Code" },
  { key: "category", label: "Category" },
  { key: "store", label: "Store" },
  { key: "required", label: "Required Quantity" },
  { key: "available", label: "Available Quantity" },
  { key: "waitingWorkOrders", label: "Work Orders Waiting" },
  { key: "criticality", label: "Criticality" },
  { key: "action", label: "Actions" },
]

const STOCK_COLUMNS = [
  { key: "item", label: "Item" },
  { key: "store", label: "Store" },
  { key: "location", label: "Location" },
  { key: "onHand", label: "On Hand" },
  { key: "reserved", label: "Reserved" },
  { key: "available", label: "Available" },
  { key: "reorderLevel", label: "Reorder Level" },
  { key: "maximumLevel", label: "Maximum Level" },
  { key: "status", label: "Status" },
  { key: "lastUpdated", label: "Last Updated" },
]

const TRANSACTION_COLUMNS = [
  { key: "id", label: "Transaction ID" },
  { key: "date", label: "Date" },
  { key: "item", label: "Item" },
  { key: "store", label: "Store" },
  { key: "type", label: "Movement Type" },
  { key: "quantity", label: "Quantity" },
  { key: "reference", label: "Reference" },
  { key: "user", label: "Performed By" },
  { key: "status", label: "Status" },
]

const STORE_COLUMNS = [
  { key: "store", label: "Store Name" },
  { key: "code", label: "Store Code" },
  { key: "location", label: "Location" },
  { key: "manager", label: "Manager / Storekeeper" },
  { key: "items", label: "Item Count" },
  { key: "stockStatus", label: "Stock Status" },
  { key: "status", label: "Status" },
]

const CONSUMPTION_COLUMNS = [
  { key: "workOrder", label: "Work Order" },
  { key: "asset", label: "Asset" },
  { key: "technician", label: "Technician" },
  { key: "item", label: "Item" },
  { key: "issued", label: "Issued Quantity" },
  { key: "consumed", label: "Consumed Quantity" },
  { key: "returned", label: "Returned Quantity" },
  { key: "remaining", label: "Remaining Quantity" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
]

const MATERIAL_REQUEST_COLUMNS = [
  { key: "id", label: "Request ID" },
  { key: "workOrder", label: "Work Order" },
  { key: "asset", label: "Asset" },
  { key: "technician", label: "Technician" },
  { key: "item", label: "Item" },
  { key: "required", label: "Required Quantity" },
  { key: "available", label: "Available Quantity" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "requestedDate", label: "Requested Date" },
  { key: "action", label: "Actions" },
]

const STATUS_OPTIONS = [
  { label: "Adequate", value: "adequate" },
  { label: "Low Stock", value: "low-stock" },
  { label: "Out of Stock", value: "out-of-stock" },
]

const TRANSACTION_OPTIONS = [
  { label: "Receipt", value: "receipt" },
  { label: "Issue", value: "issue" },
  { label: "Return", value: "return" },
  { label: "Transfer", value: "transfer" },
  { label: "Adjustment", value: "adjustment" },
]

const EMPTY_DATA: Record<string, string | number>[] = []

interface Props {
  onNavigate: (page: Page) => void
  currentPage: Page
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm font-600 text-text-primary">{title}</div>
        {description && (
          <p className="mt-1 text-xs text-text-secondary">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

function AvailabilityPanel({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode
  title: string
  message: string
}) {
  return (
    <div className="flex min-h-44 items-center gap-4 rounded-lg border border-border bg-white p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text-secondary">
        {icon}
      </div>
      <div>
        <div className="text-sm font-600 text-text-primary">{title}</div>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-text-secondary">
          {message}
        </p>
      </div>
    </div>
  )
}

const HEALTH_STATES = [
  { label: "Healthy Stock", detail: "Within configured stock thresholds" },
  { label: "Low Stock", detail: "Below reorder level" },
  { label: "Out of Stock", detail: "No available quantity" },
  { label: "Overstocked", detail: "Above maximum stock level" },
  { label: "Reserved", detail: "Allocated to active work" },
  { label: "Unavailable", detail: "Not available for issue" },
]

const TRANSACTION_CAPABILITIES = [
  { label: "Goods Receipt", message: "Goods Receipt API not connected" },
  { label: "Material Issue", message: "Material Issue API not connected" },
  { label: "Stock Return", message: "Stock Return API not connected" },
  { label: "Stock Transfer", message: "Stock Transfer API not connected" },
  { label: "Stock Adjustment", message: "Stock Adjustment API not connected" },
]

function InventoryHealth() {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldAlert size={16} className="text-gold-500" />
        <div className="text-sm font-600 text-text-primary">
          Inventory Health
        </div>
      </div>
      <div className="divide-y divide-border">
        {HEALTH_STATES.map((state) => (
          <div
            key={state.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <div className="text-sm font-500 text-text-primary">
                {state.label}
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                {state.detail}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-600 text-text-primary">—</div>
              <div className="text-xs text-text-secondary">
                Count unavailable
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TransactionCapabilities() {
  return (
    <Section
      title="Inventory Transaction Workflows"
      description="Stock-changing operations remain unavailable until transactional backend endpoints are connected."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {TRANSACTION_CAPABILITIES.map((capability) => (
          <div
            key={capability.label}
            className="rounded-lg border border-border bg-white p-4"
          >
            <div className="text-sm font-600 text-text-primary">
              {capability.label}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              {capability.message}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Items"
          value="—"
          subtitle="Inventory data unavailable"
          icon={<Boxes size={14} />}
        />
        <KpiCard
          title="Available Stock"
          value="—"
          subtitle="Balance data unavailable"
          icon={<PackageOpen size={14} />}
          accent
        />
        <KpiCard
          title="Low Stock Items"
          value="—"
          subtitle="Threshold data unavailable"
          icon={<AlertTriangle size={14} />}
        />
        <KpiCard
          title="Out of Stock"
          value="—"
          subtitle="Balance data unavailable"
          icon={<PackageX size={14} />}
          alert
        />
        <KpiCard
          title="Pending Material Issues"
          value="—"
          subtitle="Work-order material data unavailable"
          icon={<ClipboardList size={14} />}
        />
        <KpiCard
          title="Pending Receipts"
          value="—"
          subtitle="Receipt data unavailable"
          icon={<PackageCheck size={14} />}
        />
        <KpiCard
          title="Pending Returns"
          value="—"
          subtitle="Return data unavailable"
          icon={<RefreshCw size={14} />}
        />
        <KpiCard
          title="Stock Movements"
          value="—"
          subtitle="Current period unavailable"
          icon={<History size={14} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <InventoryHealth />
        <AvailabilityPanel
          icon={<AlertTriangle size={18} />}
          title="Requires Attention"
          message="No inventory alert source is connected. Out-of-stock items, pending issues, delayed receipts, discrepancies, transfers, and work orders waiting for materials cannot be evaluated."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section
          title="Low Stock Items"
          description="Items below their configured minimum stock level."
        >
          <DataTable
            columns={LOW_STOCK_COLUMNS}
            data={EMPTY_DATA}
            emptyMessage="No inventory data available."
          />
        </Section>
        <Section
          title="Out of Stock"
          description="Unavailable items that may affect active maintenance work."
        >
          <DataTable
            columns={OUT_OF_STOCK_COLUMNS}
            data={EMPTY_DATA}
            emptyMessage="No inventory data available."
          />
        </Section>
      </div>

      <Section
        title="Inventory Overview"
        description="Current balances by item and store."
      >
        <DataTable
          columns={STOCK_COLUMNS}
          data={EMPTY_DATA}
          emptyMessage="No inventory data source is connected."
        />
      </Section>

      <Section
        title="Material Requests from Work Orders"
        description="Spare-part and material demand originating from maintenance work orders."
      >
        <DataTable
          columns={MATERIAL_REQUEST_COLUMNS}
          data={EMPTY_DATA}
          emptyMessage="No material requests are currently pending."
        />
      </Section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section
          title="Recent Stock Movements"
          description="Latest inventory movements across all stores."
        >
          <DataTable
            columns={TRANSACTION_COLUMNS}
            data={EMPTY_DATA}
            emptyMessage="No stock movements recorded."
          />
        </Section>
        <Section
          title="Store Overview"
          description="Stock health and recent activity by store location."
        >
          <DataTable
            columns={STORE_COLUMNS}
            data={EMPTY_DATA}
            emptyMessage="No store inventory data available."
          />
        </Section>
      </div>

      <Section
        title="Work Order Consumption"
        description="Materials issued against maintenance work orders."
      >
        <DataTable
          columns={CONSUMPTION_COLUMNS}
          data={EMPTY_DATA}
          emptyMessage="No work order consumption data available."
        />
      </Section>

      <TransactionCapabilities />
    </div>
  )
}

export default function InventoryPage({ onNavigate, currentPage }: Props) {
  const [search, setSearch] = useState("")
  const [store, setStore] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [transactionType, setTransactionType] = useState("")
  const activeSub = TABS_MAP[currentPage] ?? "overview"

  const changeTab = (value: string) => {
    const pages: Record<string, Page> = {
      overview: "inventory",
      items: "inventory-parts",
      stock: "inventory-stock",
      movements: "inventory-movements",
    }
    onNavigate(pages[value])
  }

  const inventoryFilters = (
    <>
      <SelectFilter
        label="Store"
        options={[]}
        value={store}
        onChange={setStore}
      />
      <SelectFilter
        label="Category"
        options={[]}
        value={category}
        onChange={setCategory}
      />
      <SelectFilter
        label="Status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={setStatus}
      />
    </>
  )

  return (
    <div>
      <PageHeader
        title="STORE & INVENTORY"
        subtitle="Monitor stock availability, material movements, work-order consumption and inventory attention across stores."
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Items", value: "items" },
          { label: "Stock Levels", value: "stock" },
          { label: "Stock Movement", value: "movements" },
        ]}
        activeTab={activeSub}
        onTabChange={changeTab}
        actions={
          <span className="inline-flex items-center gap-2 rounded border border-border bg-surface-2 px-3 py-2 text-xs font-500 text-text-secondary">
            <span className="size-2 rounded-full bg-amber-500" />
            Data source not connected
          </span>
        }
      />

      <div className="space-y-6 p-6">
        <div className="rounded-lg border border-admin-warning/30 bg-admin-warning/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-admin-warning"
            />
            <div>
              <div className="text-sm font-600 text-text-primary">
                Inventory service unavailable
              </div>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                This repository does not contain an inventory API, database
                client, or transaction endpoint. Live balances and actions are
                withheld to avoid presenting fabricated operational data.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="text-xs font-500 uppercase tracking-wide text-text-secondary">
              Current Store
            </div>
            <div className="mt-1 text-sm font-600 text-text-primary">
              Data unavailable
            </div>
          </div>
          <div>
            <div className="text-xs font-500 uppercase tracking-wide text-text-secondary">
              Reporting Period
            </div>
            <div className="mt-1 text-sm font-600 text-text-primary">
              Data unavailable
            </div>
          </div>
          <div>
            <div className="text-xs font-500 uppercase tracking-wide text-text-secondary">
              Last Updated
            </div>
            <div className="mt-1 text-sm font-600 text-text-primary">
              Not available
            </div>
          </div>
          <div>
            <div className="text-xs font-500 uppercase tracking-wide text-text-secondary">
              Connection
            </div>
            <div className="mt-1 text-sm font-600 text-admin-warning">
              Not configured
            </div>
          </div>
        </div>

        {activeSub === "overview" && (
          <>
            <FilterBar
              searchPlaceholder="Search item name, item code, part number, work order or transaction ID..."
              search={search}
              onSearch={setSearch}
              filters={inventoryFilters}
            />
            <Overview />
          </>
        )}

        {activeSub === "items" && (
          <Section
            title="Inventory Items"
            description="Search the item master across stores."
          >
            <FilterBar
              searchPlaceholder="Search item code or name..."
              search={search}
              onSearch={setSearch}
              filters={inventoryFilters}
            />
            <DataTable
              columns={ITEM_COLUMNS}
              data={EMPTY_DATA}
              emptyMessage="No inventory items found."
            />
          </Section>
        )}

        {activeSub === "stock" && (
          <Section
            title="Stock Levels"
            description="Review current on-hand, reserved, and available quantities by store."
          >
            <FilterBar
              searchPlaceholder="Search item code or name..."
              search={search}
              onSearch={setSearch}
              filters={inventoryFilters}
            />
            <DataTable
              columns={STOCK_COLUMNS}
              data={EMPTY_DATA}
              emptyMessage="No stock-level data available."
            />
          </Section>
        )}

        {activeSub === "movements" && (
          <Section
            title="Stock Movement"
            description="Receipts, issues, returns, transfers, and adjustments."
          >
            <FilterBar
              searchPlaceholder="Search transaction ID, item, reference or user..."
              search={search}
              onSearch={setSearch}
              filters={
                <SelectFilter
                  label="Transaction Type"
                  options={TRANSACTION_OPTIONS}
                  value={transactionType}
                  onChange={setTransactionType}
                />
              }
            />
            <DataTable
              columns={TRANSACTION_COLUMNS}
              data={EMPTY_DATA}
              emptyMessage="No stock movements recorded."
            />
            <TransactionCapabilities />
          </Section>
        )}
      </div>
    </div>
  )
}
