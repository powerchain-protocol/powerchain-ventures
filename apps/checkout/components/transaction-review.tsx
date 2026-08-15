"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Alarm,
  Badge,
  Button,
  Card,
} from "@powerchain/ui";
import type {
  ReviewPlan,
} from "../types/checkout";
import {
  shortAddress,
  solFromLamports,
} from "../lib/formats";

export function TransactionReview({
  plan,
  onBack,
  onSubmit,
  submitting = false,
}: {
  plan: ReviewPlan;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}) {
  const [confirmed, setConfirmed] =
    useState(false);
  const [expanded, setExpanded] =
    useState<number[]>([]);
  const [now, setNow] =
    useState(
      Date.now(),
    );

  useEffect(() => {
    const timer =
      setInterval(
        () =>
          setNow(
            Date.now(),
          ),
        1_000,
      );

    return () =>
      clearInterval(timer);
  }, []);

  const expires =
    plan.expiresAt
      ? Date.parse(
          plan.expiresAt,
        )
      : null;
  const expired =
    expires !== null &&
    expires <= now;

  const canSign =
    Boolean(
      plan.serializedTransactionBase64,
    ) &&
    plan.simulation?.ok !==
      false &&
    !expired;

  const settlement =
    plan.paymentSettlement;

  return (
    <div className="checkout-review">
      <div className="checkout-section-heading">
        <div>
          <span className="eyebrow">
            Final review
          </span>
          <h2>
            Review the exact transaction
          </h2>
          <p>
            The quote authority has already
            signed these exact purchase terms.
            Your wallet supplies the buyer
            signature only after this review.
          </p>
        </div>
        <Badge
          tone={
            plan.simulation?.ok ===
            false
              ? "danger"
              : "success"
          }
          dot
        >
          {plan.simulation?.ok ===
          false
            ? "Simulation failed"
            : "Simulation passed"}
        </Badge>
      </div>

      {settlement ? (
        <Card className="settlement-card">
          <div>
            <span>
              Sale proceeds
            </span>
            <strong>
              {solFromLamports(
                settlement.paymentAmountBaseUnits,
              )}{" "}
              SOL
            </strong>
            <code>
              {shortAddress(
                settlement.paymentReceiverWallet,
                10,
                10,
              )}
            </code>
          </div>
          <div>
            <span>
              PowerChain fee
            </span>
            <strong>
              {solFromLamports(
                settlement.serviceFeeBaseUnits,
              )}{" "}
              SOL
            </strong>
            <code>
              {shortAddress(
                settlement.powerchainTreasuryWallet,
                10,
                10,
              )}
            </code>
          </div>
        </Card>
      ) : null}

      <div className="review-cost-grid">
        <div>
          <span>
            Network fee
          </span>
          <strong>
            {solFromLamports(
              plan.fees
                .networkFeeLamports,
            )}{" "}
            SOL
          </strong>
        </div>
        <div>
          <span>
            Account rent
          </span>
          <strong>
            {solFromLamports(
              plan.fees
                .rentLamports,
            )}{" "}
            SOL
          </strong>
        </div>
        <div>
          <span>
            Service fee
          </span>
          <strong>
            {solFromLamports(
              plan.fees
                .serviceFeeLamports,
            )}{" "}
            SOL
          </strong>
        </div>
      </div>

      <div className="instruction-list">
        {plan.instructions.map(
          instruction => {
            const open =
              expanded.includes(
                instruction.index,
              );

            return (
              <Card
                key={
                  instruction.index
                }
                className="instruction-card"
              >
                <button
                  type="button"
                  className="instruction-toggle"
                  onClick={() =>
                    setExpanded(
                      current =>
                        open
                          ? current.filter(
                              value =>
                                value !==
                                instruction.index,
                            )
                          : [
                              ...current,
                              instruction.index,
                            ],
                    )
                  }
                >
                  <span className="instruction-index">
                    {instruction.index +
                      1}
                  </span>
                  <span>
                    <b>
                      {
                        instruction.programName
                      }
                    </b>
                    <small>
                      {
                        instruction.summary
                      }
                    </small>
                  </span>
                  <strong>
                    {open
                      ? "−"
                      : "+"}
                  </strong>
                </button>

                {open ? (
                  <div className="instruction-detail">
                    <code>
                      {
                        instruction.programId
                      }
                    </code>

                    {instruction.accounts.map(
                      (
                        account,
                        index,
                      ) => (
                        <div
                          key={`${account.address}-${index}`}
                        >
                          <span>
                            {account.label ??
                              `Account ${
                                index +
                                1
                              }`}
                          </span>
                          <code>
                            {
                              account.address
                            }
                          </code>
                          <small>
                            {account.signer
                              ? "Signer"
                              : "Not signer"}
                            {" · "}
                            {account.writable
                              ? "Writable"
                              : "Read only"}
                          </small>
                        </div>
                      ),
                    )}
                  </div>
                ) : null}
              </Card>
            );
          },
        )}
      </div>

      {expired ? (
        <Alarm
          tone="danger"
          title="Prepared transaction expired"
        >
          Go back and prepare a fresh
          transaction before signing.
        </Alarm>
      ) : null}

      <label className="checkout-confirm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={event =>
            setConfirmed(
              event.target
                .checked,
            )
          }
        />
        <span>
          I reviewed the exact programs,
          recipients, token amount and fees
          and authorize my wallet to sign this
          transaction.
        </span>
      </label>

      <div className="checkout-review-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={
            !confirmed ||
            !canSign ||
            submitting
          }
          onClick={onSubmit}
        >
          {submitting
            ? "Submitting…"
            : "Sign & purchase"}
        </Button>
      </div>
    </div>
  );
}
