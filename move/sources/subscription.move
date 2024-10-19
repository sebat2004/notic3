module notic3::subscription {
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};
    use std::string::{String};
    use sui::vec_map::{Self, VecMap};

    public struct CreatorSubscriptionRegistry has key {
        id: UID,
        subscriptions: vector<ID>,
    }

    public struct CreatorSubscription has key {
        id: UID,
        creator: address,
        content: Table<String, Content>,
        subscriptions: VecMap<address, Subscription>,
        subscription_price: u64,
        subscription_duration: u64
    }

    public struct Subscription has store, drop {
        creator_subscription_id: ID,
        start_time: u64,
        end_time: u64
    }

    public struct Content has key, store {
        id: UID,
        hash: String,
        salt: String,
        blobId: String,
        enc_sym_keys: Option<Table<address, u64>>
    }

    fun init(ctx: &mut TxContext) {
        let registry = CreatorSubscriptionRegistry {
            id: object::new(ctx),
            subscriptions: vector::empty(),
        };
        transfer::share_object(registry);
    }

    public fun initialize(
        self: &mut CreatorSubscriptionRegistry,
        subscription_price: u64,
        subscription_duration: u64,
        ctx: &mut TxContext
    ) {
        let subscription = CreatorSubscription {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            subscriptions: vec_map::empty(),
            content: table::new(ctx),
            subscription_price,
            subscription_duration
        };
        let subscription_id = object::id(&subscription);
        transfer::share_object(subscription);

        vector::push_back(&mut self.subscriptions, subscription_id)
    }

    public entry fun content(
        self: &mut CreatorSubscription,
        content_hash: String,
        content_salt: String,
        content_blob_id: String,
        ctx: &mut TxContext
    ) {
        let new_content = Content {
            id: object::new(ctx),
            hash: content_hash,
            salt: content_salt,
            blobId: content_blob_id,
            enc_sym_keys: option::none()
        };
        table::add(&mut self.content, content_hash, new_content);
    }

    public entry fun content_enc(
        self: &mut CreatorSubscription,
        content_hash: String,
        enc_keys: vector<u64>,
        ctx: &mut TxContext,
    ) {
        assert!(table::contains(&self.content, content_hash), 0);
        let content = table::borrow_mut(&mut self.content, content_hash);

        let subscribers = vec_map::keys(&self.subscriptions);
        let len = vector::length(&subscribers);

        option::fill(&mut content.enc_sym_keys, table::new(ctx));
        let enc_sym_keys = option::borrow_mut(&mut content.enc_sym_keys);

        let mut i = 0;
        while (i < len) {
            let subscriber = *vector::borrow(&subscribers, i);
            assert!(i < vector::length(&enc_keys), 1); // Ensure we have an encrypted key for this subscriber
            let enc_key = vector::borrow(&enc_keys, i);
            table::add(enc_sym_keys, subscriber, *enc_key);
            i = i + 1;
        };
    }

    public entry fun subscribe(
        self: &mut CreatorSubscription,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let subscriber = tx_context::sender(ctx);
        let now = clock::timestamp_ms(clock);

        let subscription = Subscription {
            creator_subscription_id: object::uid_to_inner(&self.id),
            start_time: now,
            end_time: now + self.subscription_duration
        };
        vec_map::insert(&mut self.subscriptions, subscriber, subscription);
    }

    public fun is_subscribed(self: &CreatorSubscription, subscriber: address, clock: &Clock): bool {
        if (vec_map::contains(&self.subscriptions, &subscriber)) {
            let subscription = vec_map::get(&self.subscriptions, &subscriber);
            clock::timestamp_ms(clock) <= subscription.end_time
        } else {
            false
        }
    }

    public fun get_subscription_end(self: &CreatorSubscription, subscriber: address): u64 {
        let subscription = vec_map::get(&self.subscriptions, &subscriber);
        subscription.end_time
    }

    public entry fun cancel_subscription(
        self: &mut CreatorSubscription,
        ctx: &mut TxContext
    ) {
        let subscriber = tx_context::sender(ctx);
        assert!(vec_map::contains(&self.subscriptions, &subscriber), 0);
        vec_map::remove(&mut self.subscriptions, &subscriber);
        // Here you might handle refunds or other cancellation logic
    }
}