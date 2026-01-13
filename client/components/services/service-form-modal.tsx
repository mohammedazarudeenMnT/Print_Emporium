"use client"

import { useState, useEffect } from "react"
import { X, Save, IndianRupee, Settings } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getAllServiceOptions,
  upsertService,
  type Service,
  type ServiceOption,
  type OptionPricing,
} from "@/lib/service-api"
import { ImageUpload } from "@/components/ui/image-upload"
import { CategoryManagerDialog } from "./category-manager-dialog"
import { cn } from "@/lib/utils"

interface ServiceFormModalProps {
  service?: Service
  onClose: () => void
  onSuccess: () => void
}

export function ServiceFormModal({ service, onClose, onSuccess }: ServiceFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<{ [key: string]: ServiceOption[] }>({})
  const [formData, setFormData] = useState<Partial<Service>>(
    service || {
      name: "",
      image: null,
      basePricePerPage: 0,
      customQuotation: false,
      printTypes: [],
      paperSizes: [],
      paperTypes: [],
      gsmOptions: [],
      printSides: [],
      bindingOptions: [],
      status: "active",
    },
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [managerConfig, setManagerConfig] = useState<{
    category: string
    label: string
  } | null>(null)

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const categories = ["printType", "paperSize", "paperType", "gsm", "printSide", "bindingOption"]
      const results = await Promise.all(categories.map((cat) => getAllServiceOptions(cat, true)))
      const newOptions: { [key: string]: ServiceOption[] } = {}
      categories.forEach((cat, index) => {
        newOptions[cat] = results[index].data
      })
      setOptions(newOptions)
    } catch (error) {
      console.error("Error fetching options:", error)
      toast.error("Failed to load options")
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = "Service name is required"
    if ((formData.basePricePerPage || 0) < 0) newErrors.basePricePerPage = "Price cannot be negative"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    try {
      setLoading(true)
      const serviceData = {
        ...formData,
        name: formData.name?.trim() || "",
      }
      
      const res = service?._id 
        ? await upsertService({ id: service._id, ...serviceData })
        : await upsertService(serviceData as Service)
      if (res.success) {
        toast.success(service ? "Service updated" : "Service created")
        onSuccess()
      } else {
        toast.error(res.message || "Failed to save")
      }
    } catch (error: any) {
      console.error("Save error:", error)
      toast.error(error.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  const toggleOption = (category: keyof Service, option: ServiceOption) => {
    const currentList = (formData[category] as OptionPricing[]) || []
    const exists = currentList.find((item) => item.value === option.value)

    if (exists) {
      setFormData({
        ...formData,
        [category]: currentList.filter((item) => item.value !== option.value),
      })
    } else {
      setFormData({
        ...formData,
        [category]: [
          ...currentList,
          {
            value: option.value,
            pricePerPage: option.pricePerPage || 0,
            pricePerCopy: option.pricePerCopy || 0,
          },
        ],
      })
    }
  }

  const updateOptionPrice = (
    category: keyof Service,
    value: string,
    pricingType: "perPage" | "perCopy",
    amount: number,
  ) => {
    const currentList = (formData[category] as OptionPricing[]) || []
    const updated = currentList.map((item) => {
      if (item.value === value) {
        return pricingType === "perPage"
          ? { ...item, pricePerPage: amount, pricePerCopy: 0 }
          : { ...item, pricePerCopy: amount, pricePerPage: 0 }
      }
      return item
    })
    setFormData({ ...formData, [category]: updated })
  }

  const CategorySection = ({
    id,
    label,
    category,
    options: categoryOptions,
  }: {
    id: keyof Service
    label: string
    category: string
    options: ServiceOption[]
  }) => {
    const selectedOptions = (formData[id] as OptionPricing[]) || []
    const availableOptions = categoryOptions?.filter((opt) => !selectedOptions.find((o) => o.value === opt.value))

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label htmlFor={category} className="text-sm font-medium">
            {label} ({selectedOptions.length} selected)
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setManagerConfig({ category, label })}
            className="h-8 gap-1.5 text-xs"
          >
            <Settings className="h-3.5 w-3.5" />
            Manage
          </Button>
        </div>

        <Select
          onValueChange={(val) => {
            const opt = categoryOptions?.find((o) => o.value === val)
            if (opt) toggleOption(id, opt)
          }}
        >
          <SelectTrigger id={category} className="h-10 rounded-lg">
            <SelectValue placeholder={`Add ${label.toLowerCase()}...`} />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {availableOptions?.length === 0 ? (
              <div className="p-3 text-center text-sm text-muted-foreground">All added</div>
            ) : (
              availableOptions?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedOptions.length > 0 && (
          <div className="space-y-2">
            {selectedOptions.map((selected) => {
              const isPerPage = selected.pricePerPage > 0
              return (
                <div
                  key={selected.value}
                  className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg border border-border/30"
                >
                  <span className="text-sm flex-1">{selected.value}</span>

                  <Select
                    defaultValue={isPerPage ? "perPage" : "perCopy"}
                    onValueChange={(type) => {
                      const amount = isPerPage ? selected.pricePerPage : selected.pricePerCopy
                      updateOptionPrice(id, selected.value, type as "perPage" | "perCopy", amount)
                    }}
                  >
                    <SelectTrigger className="h-8 w-20 text-xs rounded">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perPage">Per Page</SelectItem>
                      <SelectItem value="perCopy">Per Copy</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative w-24">
                    <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={isPerPage ? selected.pricePerPage : selected.pricePerCopy}
                      onChange={(e) => {
                        const type = isPerPage ? "perPage" : "perCopy"
                        updateOptionPrice(id, selected.value, type, Number(e.target.value))
                      }}
                      className="h-8 pl-6 text-xs rounded"
                      placeholder="0"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const opt = categoryOptions?.find((o) => o.value === selected.value)
                      if (opt) toggleOption(id, opt)
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-2xl rounded-xl border border-border/50 shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{service ? "Update Service" : "Create Service"}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Service Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="e.g., Printing, Design"
              value={formData.name || ""}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={cn("h-10 rounded-lg", errors.name && "border-red-500")}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Service Image
            </label>
            <ImageUpload value={formData.image || null} onChange={(image) => setFormData({ ...formData, image })} />
          </div>

          <div className="space-y-2">
            <label htmlFor="basePrice" className="text-sm font-medium">
              Base Price Per Page <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.basePricePerPage || ""}
                onChange={(e) => {
                  setFormData({ ...formData, basePricePerPage: Number(e.target.value) })
                  if (errors.basePricePerPage) setErrors({ ...errors, basePricePerPage: "" })
                }}
                className={cn("h-10 pl-9 rounded-lg", errors.basePricePerPage && "border-red-500")}
              />
            </div>
            {errors.basePricePerPage && <p className="text-xs text-red-500">{errors.basePricePerPage}</p>}
          </div>

          <div className="flex items-center space-x-2 border border-border/50 p-4 rounded-lg bg-muted/20">
            <Switch
              id="customQuotation"
              checked={formData.customQuotation || false}
              onCheckedChange={(checked) => setFormData({ ...formData, customQuotation: checked })}
            />
            <div className="items-center gap-2">
              <Label htmlFor="customQuotation" className="text-sm font-semibold">Custom Quotation Service</Label>
              <p className="text-xs text-muted-foreground">Enable this to treat orders as leads without immediate print configuration.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={formData.status || "active"}
              onValueChange={(val) => setFormData({ ...formData, status: val as "active" | "inactive" })}
            >
              <SelectTrigger id="status" className="h-10 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!formData.customQuotation && (
            <div className="border-t border-border/50 pt-5">
            <h3 className="text-sm font-semibold mb-4">Service Options</h3>
            <div className="space-y-5">
              <CategorySection
                id="printTypes"
                label="Print Types"
                category="printType"
                options={options.printType || []}
              />
              <CategorySection
                id="paperSizes"
                label="Paper Sizes"
                category="paperSize"
                options={options.paperSize || []}
              />
              <CategorySection
                id="paperTypes"
                label="Paper Types"
                category="paperType"
                options={options.paperType || []}
              />
              <CategorySection id="gsmOptions" label="GSM Options" category="gsm" options={options.gsm || []} />
              <CategorySection
                id="printSides"
                label="Print Sides"
                category="printSide"
                options={options.printSide || []}
              />
              <CategorySection
                id="bindingOptions"
                label="Binding Options"
                category="bindingOption"
                options={options.bindingOption || []}
              />
            </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border/50 flex justify-end gap-3 bg-card">
          <Button variant="outline" onClick={onClose} className="h-10 rounded-lg bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="h-10 rounded-lg">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </div>

      {managerConfig && (
        <CategoryManagerDialog
          category={managerConfig.category}
          categoryLabel={managerConfig.label}
          options={options[managerConfig.category] || []}
          onClose={() => setManagerConfig(null)}
          onRefresh={fetchOptions}
        />
      )}
    </div>
  )
}
