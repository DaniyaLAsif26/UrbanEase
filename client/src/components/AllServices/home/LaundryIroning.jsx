import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { areas } from '../../../data/services.js'
import { useUser } from '../../../context/UserContext'
import { useLogin } from '../../../context/LoginContext'

const TIME_SLOTS = [
    '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '13:00 PM', '14:00 PM', '15:00 PM', '16:00 PM', '17:00 PM', '18:00 PM',
]

const STEPS = ["Details", "Schedule", "Confirm"];

function StepDots({ current }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 36 }}>
            {STEPS.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: i <= current ? "#1a1a1a" : "transparent",
                            border: i <= current ? "2px solid #1a1a1a" : "2px solid #d0d0d0",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.3s",
                        }}>
                            {i < current
                                ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                : <span style={{ fontSize: 12, fontWeight: 700, color: i === current ? "white" : "#bbb" }}>{i + 1}</span>
                            }
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: i <= current ? "#1a1a1a" : "#ccc", textTransform: "uppercase" }}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div style={{ width: 48, height: 2, background: i < current ? "#1a1a1a" : "#e8e8e8", borderRadius: 2, marginBottom: 20, transition: "background 0.3s" }} />
                    )}
                </div>
            ))}
        </div>
    );
}

function Field({ label, error, hint, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888" }}>{label}</label>
            {children}
            {hint && !error && <span style={{ fontSize: 12, color: "#bbb" }}>{hint}</span>}
            {error && <span style={{ fontSize: 12, color: "#e24b4a", fontWeight: 500 }}>{error}</span>}
        </div>
    );
}

const inputBase = {
    padding: "13px 16px",
    borderRadius: 12,
    border: "1.5px solid #ebebeb",
    background: "#fafafa",
    color: "#1a1a1a",
    fontSize: 15,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s, background 0.2s",
};

function StyledInput({ reg, name, placeholder, type = "text", min, validation, errors }) {
    return (
        <input
            type={type}
            min={min}
            placeholder={placeholder}
            {...reg(name, validation)}
            style={inputBase}
            onFocus={e => { e.target.style.borderColor = "#1a1a1a"; e.target.style.background = "#fff"; }}
            onBlur={e => { e.target.style.borderColor = errors?.[name] ? "#e24b4a" : "#ebebeb"; e.target.style.background = "#fafafa"; }}
        />
    );
}

function AreaDropdown({ reg, errors }) {
    const hasError = !!errors?.address?.area;
    return (
        <div style={{ position: "relative", display: "block", width: "100%" }}>
            <select
                {...reg("address.area", { required: "Area required" })}
                style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px 40px 13px 16px",
                    borderRadius: 12,
                    border: `1.5px solid ${hasError ? "#e24b4a" : "#ebebeb"}`,
                    background: "#fafafa",
                    color: "#1a1a1a",
                    fontSize: 15,
                    outline: "none",
                    fontFamily: "inherit",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                    visibility: "visible",
                    opacity: 1,
                }}
                onFocus={e => { e.target.style.borderColor = "#1a1a1a"; e.target.style.background = "#fff"; }}
                onBlur={e => { e.target.style.borderColor = hasError ? "#e24b4a" : "#ebebeb"; e.target.style.background = "#fafafa"; }}
            >
                <option value="">Select area</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
                <path d="M4 6l4 4 4-4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

function TimeGrid({ label, value, onChange, exclude }) {
    const slots = TIME_SLOTS.filter(t => t !== exclude);
    return (
        <Field label={label}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {slots.map(t => (
                    <button key={t} type="button" onClick={() => onChange(t)} style={{
                        padding: "10px 4px",
                        borderRadius: 10,
                        border: value === t ? "2px solid #1a1a1a" : "1.5px solid #ebebeb",
                        background: value === t ? "#1a1a1a" : "#fafafa",
                        color: value === t ? "#fff" : "#555",
                        fontSize: 12,
                        fontWeight: value === t ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        fontFamily: "inherit",
                    }}>
                        {t}
                    </button>
                ))}
            </div>
        </Field>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "13px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: 12, color: "#aaa", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 600, textAlign: "right", maxWidth: "58%" }}>{value}</span>
        </div>
    );
}

const pageWrap = {
    minHeight: "100vh",
    background: "#f2f1ed",
    padding: "48px 16px 72px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const card = {
    background: "#fff",
    borderRadius: 24,
    border: "1px solid #e8e8e8",
    padding: "32px 28px",
    width: "100%",
    maxWidth: 520,
    boxSizing: "border-box",
};

const btnPrimary = {
    padding: "15px 24px",
    borderRadius: 14,
    border: "none",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
};

const btnOutline = {
    padding: "15px 20px",
    borderRadius: 14,
    border: "1.5px solid #e0e0e0",
    background: "transparent",
    color: "#555",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
};

export default function LaundryIroning() {

    const navigate = useNavigate()

    const { userData } = useUser()
    const { isUserLoaded, isUserLoggedIn } = useLogin()

    const [step, setStep] = useState(0);
    const [schedule, setSchedule] = useState({ date: "", start: "", end: "" });
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: '', phone: '', email: '',
            address: { area: '', street: '', landmark: '' },
            notes: '',
        },
        mode: "onBlur"
    });

    useEffect(() => {
        if (isUserLoaded && isUserLoggedIn && userData) {
            if (userData.name) setValue('name', userData.name)
            if (userData.phone) setValue('phone', userData.phone)
            if (userData.email) setValue('email', userData.email)
            if (userData.address?.street) setValue('address.street', userData.address.street)
            if (userData.address?.landmark) setValue('address.landmark', userData.address.landmark)
            if (userData.address?.area) {
                const match = areas.find(a => a.toLowerCase() === userData.address.area.toLowerCase())
                setValue('address.area', match || 'Other')
            }
        }
    }, [isUserLoaded, isUserLoggedIn, userData, setValue])

    const today = new Date().toISOString().split("T")[0];

    const goNext = handleSubmit(() => setStep(s => s + 1));

    const onSubmit = handleSubmit(async (v) => {
        console.log(schedule)
        const payload = {
            name: v.name,
            phone: v.phone,
            email: v.email,
            address: {
                area: v.address.area,
                street: v.address.street,
                landmark: v.address.landmark || "",
            },
            serviceDetails: {
                notes: v.notes || "",
            },
            date: schedule.date,
            startTimeSlot: schedule.start,
            endTimeSlot: schedule.end,
            serviceType: "Laundry & ironing",
            status: 'draft',
        };

        try {
            setSubmitting(true);
            setSubmitError(null);

            const res = await fetch("http://localhost:5000/api/booking", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json()

            if (result.success) {
                const { bookingData } = result
                navigate(`/service/providers/${bookingData._id}?service=${encodeURIComponent(bookingData.serviceType)}&area=${bookingData.address.area}&duration=${bookingData.duration}`,
                    { replace: true }
                )
                setDone(true);
            }
            else alert(result.error || 'Something went wrong')

        } catch (err) {
            setSubmitError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    });

    const timeValid = schedule.date && schedule.start && schedule.end
        && TIME_SLOTS.indexOf(schedule.end) > TIME_SLOTS.indexOf(schedule.start);

    if (done) {
        const v = getValues();
        return (
            <div style={pageWrap}>
                <div style={{ ...card, textAlign: "center", padding: "48px 32px" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0f7f0", border: "2px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6L23 8" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.04em", color: "#1a1a1a" }}>
                        You're all set, {v.name.split(" ")[0]}!
                    </h2>
                    <p style={{ fontSize: 14, color: "#aaa", margin: "0 0 32px" }}>Confirmation sent to {v.email}</p>
                    <div style={{ background: "#fafafa", borderRadius: 16, padding: "4px 20px", marginBottom: 28, textAlign: "left" }}>
                        <SummaryRow label="Service" value="Laundry & Ironing" />
                        <SummaryRow label="Date" value={schedule.date} />
                        <SummaryRow label="Pickup" value={schedule.start} />
                        <SummaryRow label="Delivery by" value={schedule.end} />
                        <SummaryRow label="Area" value={v.address.area} />
                        <SummaryRow label="Street" value={v.address.street} />
                        {v.address.landmark && <SummaryRow label="Landmark" value={v.address.landmark} />}
                    </div>
                    <button onClick={() => { setStep(0); setSchedule({ date: "", start: "", end: "" }); setDone(false); }} style={btnOutline}>
                        Book another slot
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={pageWrap}>
            <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 520, width: "100%" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#fff", padding: "9px 18px", borderRadius: 100, marginBottom: 18, fontSize: 12, fontWeight: 700, letterSpacing: "0.07em" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                    LAUNDRY &amp; IRONING
                </div>
                <h1 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.04em", color: "#1a1a1a", lineHeight: 1.05 }}>
                    Fresh clothes,<br />zero effort.
                </h1>
                <p style={{ fontSize: 14, color: "#aaa", margin: 0 }}>Pickup · Wash · Press · Deliver — same day.</p>
            </div>

            <div style={card}>
                <StepDots current={step} />

                {step === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Field label="Full name" error={errors.name?.message}>
                                <StyledInput reg={register} name="name" placeholder="Arjun Mehta" errors={errors}
                                    validation={{ required: "Name is required" }} />
                            </Field>
                            <Field label="Phone" error={errors.phone?.message}>
                                <StyledInput reg={register} name="phone" placeholder="+91 98765 43210" errors={errors}
                                    validation={{ required: "Required", pattern: { value: /^\+?[\d\s\-]{8,}$/, message: "Invalid number" } }} />
                            </Field>
                        </div>

                        <Field label="Email" error={errors.email?.message}>
                            <StyledInput reg={register} name="email" type="email" placeholder="arjun@email.com" errors={errors}
                                validation={{ required: "Email required", pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email" } }} />
                        </Field>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Field label="Area" error={errors.address?.area?.message}>
                                <AreaDropdown reg={register} errors={errors} />
                            </Field>
                            <Field label="Landmark">
                                <StyledInput reg={register} name="address.landmark" placeholder="Near Metro Station" errors={errors} />
                            </Field>
                        </div>

                        <Field label="Street" error={errors.address?.street?.message}>
                            <StyledInput reg={register} name="address.street" placeholder="Flat 3A, Jubilee Hills" errors={errors}
                                validation={{ required: "Street required" }} />
                        </Field>

                        <Field label="Special instructions (optional)">
                            <textarea
                                {...register("notes")}
                                placeholder="Delicate fabrics, starch preference, anything else..."
                                rows={3}
                                style={{ ...inputBase, resize: "vertical", lineHeight: 1.6 }}
                                onFocus={e => { e.target.style.borderColor = "#1a1a1a"; e.target.style.background = "#fff"; }}
                                onBlur={e => { e.target.style.borderColor = "#ebebeb"; e.target.style.background = "#fafafa"; }}
                            />
                        </Field>
                        <button onClick={goNext} style={{ ...btnPrimary, width: "100%" }}>
                            Continue to schedule →
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <Field label="Pickup date">
                            <input type="date" min={today} value={schedule.date}
                                onChange={e => setSchedule(s => ({ ...s, date: e.target.value }))}
                                style={inputBase}
                                onFocus={e => { e.target.style.borderColor = "#1a1a1a"; e.target.style.background = "#fff"; }}
                                onBlur={e => { e.target.style.borderColor = "#ebebeb"; e.target.style.background = "#fafafa"; }}
                            />
                        </Field>
                        <TimeGrid label="Pickup time" value={schedule.start}
                            onChange={v => setSchedule(s => ({ ...s, start: v, end: "" }))} />
                        {schedule.start && (
                            <TimeGrid label="Delivery by" value={schedule.end}
                                onChange={v => setSchedule(s => ({ ...s, end: v }))} exclude={schedule.start} />
                        )}
                        {schedule.start && schedule.end && !timeValid && (
                            <p style={{ fontSize: 13, color: "#e24b4a", fontWeight: 500, margin: 0 }}>Delivery must be after pickup.</p>
                        )}
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setStep(0)} style={btnOutline}>← Back</button>
                            <button
                                onClick={() => { if (timeValid) setStep(2); else alert("Please fill all schedule fields correctly."); }}
                                style={{ ...btnPrimary, flex: 1 }}
                            >
                                Review booking →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (() => {
                    const v = getValues();
                    return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "#fafafa", borderRadius: 14 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>Laundry & Ironing</div>
                                    <div style={{ fontSize: 12, color: "#aaa" }}>Full service — wash, dry & press</div>
                                </div>
                            </div>

                            <div style={{ background: "#fafafa", borderRadius: 16, padding: "4px 20px" }}>
                                <SummaryRow label="Name" value={v.name} />
                                <SummaryRow label="Phone" value={v.phone} />
                                <SummaryRow label="Email" value={v.email} />
                                <SummaryRow label="Area" value={v.address.area} />
                                <SummaryRow label="Street" value={v.address.street} />
                                {v.address.landmark && <SummaryRow label="Landmark" value={v.address.landmark} />}
                                <SummaryRow label="Date" value={schedule.date} />
                                <SummaryRow label="Pickup" value={schedule.start} />
                                <SummaryRow label="Delivery by" value={schedule.end} />
                                {v.notes && <SummaryRow label="Notes" value={v.notes} />}
                            </div>

                            {submitError && (
                                <p style={{ fontSize: 13, color: "#e24b4a", fontWeight: 500, margin: 0 }}>
                                    {submitError}
                                </p>
                            )}

                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={() => setStep(1)} style={btnOutline} disabled={submitting}>
                                    ← Edit
                                </button>
                                <button
                                    onClick={onSubmit}
                                    disabled={submitting}
                                    style={{ ...btnPrimary, flex: 1, opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                                >
                                    {submitting ? "Booking..." : "Confirm booking ✓"}
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 28 }}>
                {[["24h", "Turnaround"], ["100%", "Satisfaction"], ["Free", "Pickup & drop"]].map(([val, lbl]) => (
                    <div key={lbl} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.03em" }}>{val}</div>
                        <div style={{ fontSize: 11, color: "#bbb", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{lbl}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}