/** @odoo-module **/

import { registerModel } from '@mail/model/model_core';
import { many, one } from '@mail/model/model_field';
import { insertAndReplace } from '@mail/model/model_field_command';

registerModel({
    name: 'EmojiCategoryBarView',
    recordMethods: {
        /**
         * @private
         * @returns {FieldCommand}
         */
        _computeActiveCategoryView() {
            if (!this.activeByUserCategoryView) {
                return this.defaultActiveCategoryView;
            }
            return this.activeByUserCategoryView;
        },
        /**
         * @private
         * @returns {FieldCommand}
         */
        _computeDefaultActiveCategoryView() {
            return insertAndReplace({
                emojiCategory: insertAndReplace({ categoryName: "all" }),
                emojiCategoryBarViewOwner: this,
            });
        },
        /**
         * @private
         * @returns {FieldCommand}
         */
        _computeEmojiCategoryViews() {
            return insertAndReplace(
                this.messaging.emojiRegistry.allCategories.map(emojiCategory => {
                    return { emojiCategory };
                })
            );
        },
    },
    fields: {
        activeByUserCategoryView: one('EmojiCategoryView', {
            inverse: 'emojiCategoryBarViewOwnerAsActiveByUser',
        }),
        activeCategoryView: one('EmojiCategoryView', {
            compute: '_computeActiveCategoryView',
            inverse: 'emojiCategoryBarViewOwnerAsActive',
            required: true,
        }),
        defaultActiveCategoryView: one('EmojiCategoryView', {
            compute: '_computeDefaultActiveCategoryView',
        }),
        emojiCategoryViews: many('EmojiCategoryView', {
            compute: '_computeEmojiCategoryViews',
            inverse: 'emojiCategoryBarViewOwner',
            isCausal: true,
        }),
        emojiPickerViewOwner: one('EmojiPickerView', {
            identifying: true,
            inverse: 'emojiCategoryBarView',
            readonly: true,
            required: true,
        }),
    },
});
