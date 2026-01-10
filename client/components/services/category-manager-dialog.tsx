"use client"

import { useState } from "react"
import { X, Plus, Edit2, Trash2, Save, IndianRupee, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { type ServiceOption, upsertServiceOption, deleteServiceOption } from "@/lib/service-api"
import { cn } from "@/lib/utils"

interface CategoryManagerDialogProps {
  category: string
  categoryLabel: string
  options: ServiceOption[]
  onClose: () => void
  onRefresh: () => Promise<void>
}

export function CategoryManagerDialog({
  category,
  categoryLabel,
  options,
  onClose,
  onRefresh,
}: CategoryManagerDialogProps) {
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    isActive: true,
    pricePerPage: 0,
    pricePerCopy: 0,
  })
  const [isAdding, setIsAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [pricingType, setPricingType] = useState<"perPage" | "perCopy">("perPage")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const generateValue = (label: string) => {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.label.trim()) {
      errors.label = "Label is required"
    } else if (formData.label.trim().length < 2) {
      errors.label = "Label must be at least 2 characters"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async (id?: string) => {
    if (!validateForm()) {
      return
    }

    const finalPricePerPage = pricingType === "perPage" ? formData.pricePerPage : 0
    const finalPricePerCopy = pricingType === "perCopy" ? formData.pricePerCopy : 0

    try {
      setLoading(true)
      const res = await upsertServiceOption({
        id,
        category: category as any,
        label: formData.label.trim(),
        value: formData.value || generateValue(formData.label),
        isActive: formData.isActive,
        pricePerPage: finalPricePerPage,
        pricePerCopy: finalPricePerCopy,
      })

      if (res.success) {
        toast.success(`${categoryLabel} saved`)
        setEditingId(null)
        setIsAdding(false)
        setFormData({
          label: "",
          value: "",
          isActive: true,
          pricePerPage: 0,
          pricePerCopy: 0,
        })
        setPricingType("perPage")
        setValidationErrors({})
        await onRefresh()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setLoading(true)
      const res = await deleteServiceOption(deleteId)
      if (res.success) {
        toast.success("Option deleted")
        await onRefresh()
      }
    } catch (error) {
      toast.error("Failed to delete")
    } finally {
      setLoading(false)
      setDeleteId(null)
    }
  }

  const OptionForm = ({ isNew = false }: { isNew?: boolean }) => (
    <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/30">
      <div className="space-y-2">
        <label htmlFor="optionLabel" className="text-sm font-medium block">
          {categoryLabel} Label <span className="text-red-500">*</span>
        </label>
        <Input
          id="optionLabel"
          placeholder={`e.g. A4 Size, Color Printing`}
          value={formData.label}
          onChange={(e) => {
            setFormData({ ...formData, label: e.target.value })
            if (validationErrors.label) {
              setValidationErrors({ ...validationErrors, label: "" })
            }
          }}
          className={cn("h-10 rounded-lg", validationErrors.label && "border-red-500 focus:ring-red-500")}
          aria-invalid={!!validationErrors.label}
          aria-describedby={validationErrors.label ? "label-error" : undefined}
          autoFocus
        />
        {validationErrors.label && (
          <p id="label-error" className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {validationErrors.label}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="pricingType" className="text-sm font-medium block">
          Pricing Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={pricingType === "perPage" ? "default" : "outline"}
            size="sm"
            className="h-10 font-medium rounded-lg"
            onClick={() => {
              setPricingType("perPage")
              setFormData({ ...formData, pricePerCopy: 0 })
            }}
          >
            Per Page
          </Button>
          <Button
            type="button"
            variant={pricingType === "perCopy" ? "default" : "outline"}
            size="sm"
            className="h-10 font-medium rounded-lg"
            onClick={() => {
              setPricingType("perCopy")
              setFormData({ ...formData, pricePerPage: 0 })
            }}
          >
            Per Copy
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="optionPrice" className="text-sm font-medium block">
          {pricingType === "perPage" ? "Price Per Page" : "Price Per Copy"} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="optionPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            value={pricingType === "perPage" ? formData.pricePerPage : formData.pricePerCopy}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (pricingType === "perPage") {
                setFormData({ ...formData, pricePerPage: value, pricePerCopy: 0 })
              } else {
                setFormData({ ...formData, pricePerCopy: value, pricePerPage: 0 })
              }
            }}
            className="h-10 pl-9 rounded-lg font-mono"
          />
        </div>
        <p className="text-xs text-muted-foreground">Only one pricing type can be set per option</p>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-md rounded-xl border border-border/50 shadow-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Manage {categoryLabel}</h3>
            <p className="text-sm text-muted-foreground">Add and edit options</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {options.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
              <Plus className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No {categoryLabel.toLowerCase()} options yet</p>
            </div>
          )}

          {options.map((option) => (
            <div
              key={option._id}
              className="group flex flex-col p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
            >
              {editingId === option._id ? (
                <div className="space-y-3">
                  <OptionForm />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleSave(option._id)} disabled={loading} className="gap-1.5">
                      <Save className="h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.pricePerPage! > 0 ? `₹${option.pricePerPage}/page` : ""}
                      {option.pricePerPage! > 0 && option.pricePerCopy! > 0 ? " • " : ""}
                      {option.pricePerCopy! > 0 ? `₹${option.pricePerCopy}/copy` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50"
                      onClick={() => {
                        setEditingId(option._id!)
                        const hasPagePrice = (option.pricePerPage || 0) > 0
                        const hasCopyPrice = (option.pricePerCopy || 0) > 0
                        setPricingType(hasCopyPrice && !hasPagePrice ? "perCopy" : "perPage")
                        setFormData({
                          label: option.label,
                          value: option.value,
                          isActive: option.isActive,
                          pricePerPage: option.pricePerPage || 0,
                          pricePerCopy: option.pricePerCopy || 0,
                        })
                      }}
                      aria-label={`Edit ${option.label}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteId(option._id!)}
                      aria-label={`Delete ${option.label}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAdding && (
            <div className="space-y-3">
              <OptionForm isNew />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setFormData({ label: "", value: "", isActive: true, pricePerPage: 0, pricePerCopy: 0 })
                    setValidationErrors({})
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleSave()} disabled={loading} className="gap-1.5">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isAdding && (
          <div className="px-4 py-3 border-t border-border/50">
            <Button
              className="w-full gap-2 rounded-lg h-10 font-medium bg-transparent"
              variant="outline"
              onClick={() => {
                setIsAdding(true)
                setFormData({
                  label: "",
                  value: "",
                  isActive: true,
                  pricePerPage: 0,
                  pricePerCopy: 0,
                })
                setPricingType("perPage")
                setValidationErrors({})
              }}
            >
              <Plus className="h-4 w-4" />
              Add {categoryLabel}
            </Button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={`Delete ${categoryLabel}?`}
        description="This action cannot be undone. It may affect services using this option."
        confirmLabel="Delete"
      />
    </div>
  )
}
