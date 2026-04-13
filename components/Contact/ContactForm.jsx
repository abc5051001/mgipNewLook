import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const formData = new FormData(e.target);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      setSubmitted(true);
      reset();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-brand-navy">Message Sent!</h3>
        <p className="text-muted-foreground max-w-xs text-sm">
          Thank you for reaching out. A member of our team will be in touch shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="mt-2">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="bot-field" />
      <input type="hidden" name="subject" value="Contact Form Submission" />

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title (Optional)</Label>
        <Select id="title" name="title" {...register("title")}>
          <option value="">Select…</option>
          <option value="Mr">Mr</option>
          <option value="Ms">Ms</option>
          <option value="Mrs">Mrs</option>
          <option value="Dr">Dr</option>
        </Select>
      </div>

      {/* Name row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            name="firstname"
            placeholder="Jane"
            className={cn(errors.firstname && "border-destructive focus-visible:ring-destructive")}
            {...register("firstname", { required: "Required" })}
          />
          {errors.firstname && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> {errors.firstname.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            name="lastname"
            placeholder="Smith"
            className={cn(errors.lastname && "border-destructive focus-visible:ring-destructive")}
            {...register("lastname", { required: "Required" })}
          />
          {errors.lastname && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> {errors.lastname.message}
            </p>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="space-y-1.5">
        <Label htmlFor="company">Company (Optional)</Label>
        <Input id="company" name="company" placeholder="Acme Corp" {...register("company")} />
      </div>

      {/* Email + Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
            {...register("email", {
              required: "Required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
          />
          {errors.email && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register("phone", {
              pattern: { value: /^\+?[\d\s\-().]+$/i, message: "Invalid number" },
            })}
          />
          {errors.phone && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle size={11} /> {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="content">Message</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="How can we help you?"
          className={cn(
            "min-h-[140px]",
            errors.content && "border-destructive focus-visible:ring-destructive"
          )}
          {...register("content", { required: "Required" })}
        />
        {errors.content && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle size={11} /> {errors.content.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle size={14} />
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send Message"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form you agree to our{" "}
        <a href="/disclaimer" className="underline hover:text-brand-navy">Disclaimer</a>.
        Submitting does not create an attorney-client relationship.
      </p>
    </form>
  );
};

export default ContactForm;
